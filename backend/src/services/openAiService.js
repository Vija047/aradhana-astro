import { ChatOpenAI } from "@langchain/openai";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

let chatModel = null;

export const openAiService = {
  /**
   * Returns the initialized ChatOpenAI instance.
   */
  getChatModel() {
    if (chatModel) return chatModel;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("your_openai_api_key_here")) {
      logger.warn("OPENAI_API_KEY is not set. Requests will fail if no mock is used.");
    }

    chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4o-mini", // fast, cheap and supports tool calling
      temperature: 0.2,
      streaming: true,
    });

    logger.info("Initialized ChatOpenAI model (gpt-4o-mini).");
    return chatModel;
  }
};
