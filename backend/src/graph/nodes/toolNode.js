import { ToolMessage } from "@langchain/core/messages";
import { tools } from "../../tools/index.js";
import { logger } from "../../utils/logger.js";

/**
 * toolNode.js
 * Iterates through the requested tool calls from the reasoning node,
 * executes them, and appends the outputs back to the graph state.
 */
export const toolNode = async (state) => {
  logger.info("Executing toolNode...");
  const lastMessage = state.messages[state.messages.length - 1];

  if (!lastMessage || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    logger.warn("toolNode was triggered but no tool calls were requested in the state.");
    return {};
  }

  const toolMessages = [];
  const newToolOutputs = [];
  const updatedBirthDetails = {};

  for (const call of lastMessage.tool_calls) {
    const { name, args, id } = call;
    logger.info(`Invoking tool "${name}" with parameters: ${JSON.stringify(args)}`);

    const targetTool = tools.find((t) => t.name === name);
    if (!targetTool) {
      const errorStr = `Error: Tool "${name}" is not registered in the assistant framework.`;
      logger.error(errorStr);
      toolMessages.push(new ToolMessage({ content: JSON.stringify({ error: errorStr }), name, tool_call_id: id }));
      continue;
    }

    try {
      const outputString = await targetTool.invoke(args);
      logger.info(`Tool "${name}" executed successfully.`);

      toolMessages.push(new ToolMessage({ content: outputString, name, tool_call_id: id }));

      const parsedOutput = JSON.parse(outputString);
      newToolOutputs.push({
        tool: name,
        input: args,
        output: parsedOutput
      });

      // If geocoding succeeds, extract coordinates and timezone to state immediately
      if (name === "geocode_place" && parsedOutput && !parsedOutput.error) {
        updatedBirthDetails.latitude = parsedOutput.latitude;
        updatedBirthDetails.longitude = parsedOutput.longitude;
        updatedBirthDetails.timezone = parsedOutput.timezone;
        if (parsedOutput.formattedAddress) {
          updatedBirthDetails.location = parsedOutput.formattedAddress;
        }
      }
    } catch (err) {
      logger.error(`Error running tool "${name}":`, err.message);
      toolMessages.push(
        new ToolMessage({
          content: JSON.stringify({ error: `Failed to execute tool: ${err.message}` }),
          name,
          tool_call_id: id
        })
      );
    }
  }

  const stateUpdate = {
    messages: toolMessages,
    toolOutputs: newToolOutputs
  };

  if (Object.keys(updatedBirthDetails).length > 0) {
    stateUpdate.userBirthDetails = updatedBirthDetails;
  }

  return stateUpdate;
};
