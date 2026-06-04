import { logger } from "../../utils/logger.js";

/**
 * routerEdge.js
 * Inspects the final message of the reasoning step.
 * Routes to 'tools' if tool calls are requested, otherwise routes to the END of the graph.
 */
export const routerEdge = (state) => {
  logger.info("Evaluating routerEdge...");
  const lastMessage = state.messages[state.messages.length - 1];

  if (lastMessage && lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    logger.info(`Routing to toolNode (requested: ${lastMessage.tool_calls.map(tc => tc.name).join(", ")}).`);
    return "tools";
  }

  logger.info("No tool calls found. Routing to END.");
  return "__end__";
};
