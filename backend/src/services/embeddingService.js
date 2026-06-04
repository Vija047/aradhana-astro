import { OpenAIEmbeddings } from "@langchain/openai";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

let embeddingsInstance = null;

export const embeddingService = {
  /**
   * Get the initialized OpenAIEmbeddings client.
   */
  getEmbeddings() {
    if (embeddingsInstance) return embeddingsInstance;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes("your_openai_api_key_here")) {
      logger.warn("OPENAI_API_KEY is not set. Embeddings will use mock fallbacks.");
    }

    embeddingsInstance = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: "text-embedding-3-small",
    });

    logger.info("Initialized OpenAIEmbeddings client.");
    return embeddingsInstance;
  },

  /**
   * Embed a single query string.
   */
  async embedQuery(text) {
    try {
      const emb = this.getEmbeddings();
      return await emb.embedQuery(text);
    } catch (error) {
      logger.error("Error embedding query. Using zero-vector fallback:", error.message);
      // Return a standard 1536-dimension zero vector
      return new Array(1536).fill(0);
    }
  },

  /**
   * Embed multiple document texts.
   */
  async embedDocuments(texts) {
    try {
      const emb = this.getEmbeddings();
      return await emb.embedDocuments(texts);
    } catch (error) {
      logger.error("Error embedding documents. Using zero-vector fallbacks:", error.message);
      return texts.map(() => new Array(1536).fill(0));
    }
  }
};
