import { MongoClient } from 'mongodb';
import { logger } from '../utils/logger.js';

let client = null;
let db = null;
let collection = null;

// In-memory session store fallback
const memoryStore = new Map();

export const mongoDbService = {
  /**
   * Connect to MongoDB. Falls back to in-memory storage if connection fails or URI is missing.
   */
  async connect() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('your_') || mongoUri.includes('localhost') && process.env.NODE_ENV === 'test') {
      logger.warn('MONGO_URI is missing or we are in testing. Using in-memory session persistence fallback.');
      return;
    }

    try {
      client = new MongoClient(mongoUri, { connectTimeoutMS: 5000 });
      await client.connect();
      db = client.db('astroagent');
      collection = db.collection('conversations');
      logger.info('Successfully connected to MongoDB conversation store.');
    } catch (error) {
      logger.error('Failed to connect to MongoDB. Falling back to in-memory store:', error.message);
      client = null;
      db = null;
      collection = null;
    }
  },

  /**
   * Load state for a given sessionId.
   */
  async loadState(sessionId) {
    if (!sessionId) return null;

    if (collection) {
      try {
        const result = await collection.findOne({ sessionId });
        if (result) {
          logger.info(`Successfully loaded state from MongoDB for session: ${sessionId}`);
          return result.state;
        }
      } catch (error) {
        logger.error(`Error loading state for session ${sessionId} from MongoDB:`, error.message);
      }
    }

    // In-memory fallback
    logger.debug(`Loaded state from memory fallback for session: ${sessionId}`);
    return memoryStore.get(sessionId) || null;
  },

  /**
   * Save state for a given sessionId.
   */
  async saveState(sessionId, state) {
    if (!sessionId || !state) return;

    // Sanitize and serialize state objects
    const serializedState = JSON.parse(JSON.stringify(state));

    if (collection) {
      try {
        await collection.updateOne(
          { sessionId },
          { $set: { sessionId, state: serializedState, updatedAt: new Date() } },
          { upsert: true }
        );
        logger.info(`Successfully saved state to MongoDB for session: ${sessionId}`);
        return;
      } catch (error) {
        logger.error(`Error saving state for session ${sessionId} to MongoDB:`, error.message);
      }
    }

    // In-memory fallback
    logger.debug(`Saved state to memory fallback for session: ${sessionId}`);
    memoryStore.set(sessionId, serializedState);
  },

  /**
   * Close the MongoDB client connection.
   */
  async disconnect() {
    if (client) {
      try {
        await client.close();
        logger.info('Closed MongoDB connection.');
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error.message);
      }
    }
  }
};
