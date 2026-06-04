import dotenv from "dotenv";
import app from "./app.js";
import { mongoDbService } from "./services/mongoDbService.js";
import { pineconeService } from "./services/pineconeService.js";
import { logger } from "./utils/logger.js";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Boots the server by establishing database connections and starting the Express app.
 */
const startServer = async () => {
  logger.info("Initializing AstroAgent backend databases...");
  
  // 1. Establish database connection states (with in-memory fallbacks)
  await mongoDbService.connect();
  await pineconeService.connect();

  // 2. Upsert baseline documents for RAG (if database credentials exist)
  await pineconeService.upsertAstrologyDocuments();

  // 3. Start the Express HTTP server
  app.listen(PORT, () => {
    logger.info(`AstroAgent API server successfully listening on port: ${PORT}`);
    logger.info(`Health check available at: http://localhost:${PORT}/health`);
  });
};

startServer().catch((error) => {
  logger.error("Fatal error during AstroAgent startup:", error);
  process.exit(1);
});
