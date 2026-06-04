import { AIMessage } from "@langchain/core/messages";
import { openAiService } from "../../services/openAiService.js";
import { tools } from "../../tools/index.js";
import { logger } from "../../utils/logger.js";

/**
 * reasoningNode.js
 * Invokes the OpenAI model (bound with our tools) to either decide on the next tool call
 * or generate the final user response. Handles safety refusals immediately.
 */
export const reasoningNode = async (state) => {
  logger.info("Executing reasoningNode...");

  const { currentIntent, userBirthDetails, messages } = state;

  // Handle safety refusals immediately without unnecessary LLM invocation
  if (currentIntent === "safety_refusal") {
    logger.info("Intent is safety_refusal. Directing to safety message response.");
    return {
      messages: [
        new AIMessage({
          content: "I cannot fulfill this request. As an AI astrology assistant, I do not provide medical, legal, or financial diagnoses, advice, or recommendations. Additionally, I must decline any actions that attempt to override my system instructions. Please consult a qualified professional for health, medical, legal, or financial matters."
        })
      ]
    };
  }

  // Validate birth details date if present in userBirthDetails
  if (userBirthDetails && userBirthDetails.date && userBirthDetails.date !== "null" && userBirthDetails.date !== "null-null-null") {
    const dateStr = String(userBirthDetails.date).trim();
    
    // Check YYYY-MM-DD format
    const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      logger.info(`Invalid birth date format detected: "${dateStr}".`);
      return {
        messages: [
          new AIMessage({
            content: "The birth date format is invalid. Please provide a valid birth date in YYYY-MM-DD format."
          })
        ]
      };
    }

    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);

    // Month must be 1-12 and day must be 1-31
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      logger.info(`Invalid date values detected: month=${month}, day=${day}.`);
      return {
        messages: [
          new AIMessage({
            content: "The birth date you provided is invalid. Please check the month and day and provide a valid date in YYYY-MM-DD format."
          })
        ]
      };
    }

    // Days in specific month check
    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
      logger.info(`Non-existent calendar date detected: ${dateStr}.`);
      return {
        messages: [
          new AIMessage({
            content: "The birth date you provided does not exist on the calendar. Please check the details and provide a valid birth date."
          })
        ]
      };
    }

    // Check future dates (relative to current date 2026-06-04)
    const currentDate = new Date(2026, 5, 4); // June 4, 2026
    if (dateObj > currentDate) {
      logger.info(`Future birth date detected: ${dateStr}.`);
      return {
        messages: [
          new AIMessage({
            content: "The birth date you provided is in the future. I can only compute birth charts for dates in the past. Please check your details."
          })
        ]
      };
    }
  }


  // Extract current birth details to construct context
  let birthContext = "";
  if (userBirthDetails && Object.keys(userBirthDetails).length > 0) {
    birthContext = `\nUser Birth Details currently on file: ${JSON.stringify(userBirthDetails)}`;
  }

  const systemInstructions = 
    "You are AstroAgent, a professional, intuitive AI astrology assistant.\n" +
    "Your tasks are:\n" +
    "1. Always address the user by their name if it is on file in the conversation context (e.g. 'name' in userBirthDetails). Do not ask the user for details (such as name, birth date, time, or location) that are already on file.\n" +
    "2. You MUST resolve locations to coordinates and timezone using 'geocode_place' first. Do not guess, estimate, or construct latitude, longitude, or timezone values yourself. You are only allowed to run 'compute_birth_chart' or 'get_daily_transits' if the 'latitude', 'longitude', and 'timezone' values are explicitly listed in the 'User Birth Details currently on file' section. If they are not listed there, you MUST call 'geocode_place' first.\n" +
    "3. For birth chart requests: You require a birth date (YYYY-MM-DD), birth time (HH:MM), and coordinates. If coordinates are present in the 'User Birth Details currently on file' section, run 'compute_birth_chart' directly. Otherwise, call 'geocode_place' first.\n" +
    "4. For daily transits: If coordinates are present in the 'User Birth Details currently on file' section, run 'get_daily_transits' directly. Otherwise, call 'geocode_place' first.\n" +
    "5. For general concepts, houses, planets, or definitions: Call 'knowledge_lookup' to get reference documents.\n" +
    "6. Always integrate tool outputs naturally into your answer. Explain planetary positions or transit impacts.\n" +
    "7. Be concise, warm, and helpful. Do not mention the names of tools directly to the user unless it helps their understanding.\n" +
    "8. You are strictly an astrology companion. Politely decline to answer off-topic queries (such as cooking recipes, general science, trivia, or non-astrology advice) by explaining that your purpose is to guide them on their astrological and spiritual journey.\n" +
    `Current conversation context: ${birthContext || "No birth details recorded yet."}`;

  // Get chat model and bind the tools to it
  const chatModel = openAiService.getChatModel();
  const modelWithTools = chatModel.bindTools(tools);

  // Compile prompt history
  const formattedMessages = [
    { role: "system", content: systemInstructions },
    ...messages
  ];

  try {
    const response = await modelWithTools.invoke(formattedMessages);
    return {
      messages: [response]
    };
  } catch (error) {
    logger.error("Error executing model in reasoningNode:", error.message);
    return {
      messages: [
        new AIMessage({
          content: "I encountered an error while processing your request. Please try again in a moment."
        })
      ]
    };
  }
};
