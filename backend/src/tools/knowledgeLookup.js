import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../utils/logger.js";
import { pineconeService } from "../services/pineconeService.js";

/**
 * knowledge_lookup tool definition.
 * Connects to Pinecone (or fallback mock) to fetch background context.
 */
export const knowledge_lookup = tool(
  async ({ query }) => {
    logger.info(`Tool knowledge_lookup executing for query: "${query}"`);
    try {
      const results = await pineconeService.query(query);
      return JSON.stringify({
        query,
        results
      });
    } catch (error) {
      logger.error("Error in knowledge_lookup tool execution:", error.message);
      return JSON.stringify({
        query,
        error: error.message,
        results: []
      });
    }
  },
  {
    name: "knowledge_lookup",
    description: "Performs semantic search against astrology reference documents to retrieve relevant concepts, planetary definitions, and rules.",
    schema: z.object({
      query: z.string().describe("The search query detailing the astrology concept or question")
    })
  }
);
