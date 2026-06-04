import { Pinecone } from '@pinecone-database/pinecone';
import { logger } from '../utils/logger.js';
import { embeddingService } from './embeddingService.js';
import dotenv from 'dotenv';

dotenv.config();

let pineconeClient = null;
let pineconeIndex = null;

// Baseline reference astrology documents for the RAG lookup tool
const mockDocuments = [
  {
    id: "doc1",
    text: "Astrology birth charts map the planetary positions at the exact moment of birth. The Ascendant (Rising Sign) represents the mask shown to the world, outer behavior, and the physical body. The Sun represents the core ego, identity, purpose, and life path. The Moon represents the emotional landscape, subconscious needs, security, and intuitive reactions."
  },
  {
    id: "doc2",
    text: "Planetary transits occur when moving planets aspect the static positions in a native's natal chart. Mercury Retrograde is a period of apparent backward motion of the planet Mercury, during which communication, travel, and technology are believed to experience disruptions, delays, or misunderstandings. It is a time for reflection, revision, and reassessment."
  },
  {
    id: "doc3",
    text: "The twelve astrological houses represent different areas of life. The 1st house is the self, appearance, and new beginnings. The 2nd house represents finances, personal values, and material possessions. The 10th house is the Midheaven, representing career, public reputation, and worldly ambitions. The 7th house represents relationships, partnerships, and marriage."
  },
  {
    id: "doc4",
    text: "The fire signs (Aries, Leo, Sagittarius) are passionate, energetic, and intuitive. The earth signs (Taurus, Virgo, Capricorn) are practical, grounded, and stable. The air signs (Gemini, Libra, Aquarius) are intellectual, social, and communicative. The water signs (Cancer, Scorpio, Pisces) are emotional, intuitive, and deeply sensitive."
  },
  {
    id: "doc5",
    text: "Astrology transits today show Mars moving through Leo, which increases ambition, passion, and creative self-expression. Saturn in Pisces prompts structural reviews of our dreams, subconscious boundaries, and spiritual discipline. Jupiter in Gemini expands intellectual curiosity, communication, and learning."
  }
];

export const pineconeService = {
  /**
   * Connect to the Pinecone client. Falls back to mock if configuration is missing.
   */
  async connect() {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;

    if (!apiKey || !indexName || apiKey.includes("your_")) {
      logger.warn("Pinecone API key or Index Name is missing or default. Using local mock vector store fallback.");
      return;
    }

    try {
      pineconeClient = new Pinecone({ apiKey });
      pineconeIndex = pineconeClient.index(indexName);
      logger.info(`Successfully connected to Pinecone index: ${indexName}`);
    } catch (error) {
      logger.error("Failed to connect to Pinecone. Using mock fallback:", error.message);
      pineconeClient = null;
      pineconeIndex = null;
    }
  },

  /**
   * Query the Pinecone index for matches. Falls back to mock query.
   */
  async query(queryText, limit = 2) {
    logger.info(`Pinecone querying for: "${queryText}"`);

    if (!pineconeClient || !pineconeIndex) {
      logger.debug("Pinecone not initialized. Using local text search.");
      return this.mockQuery(queryText, limit);
    }

    try {
      const queryEmbedding = await embeddingService.embedQuery(queryText);
      const queryResponse = await pineconeIndex.query({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true
      });

      if (queryResponse.matches && queryResponse.matches.length > 0) {
        return queryResponse.matches.map(match => ({
          text: match.metadata?.text || "",
          score: match.score || 0
        }));
      }

      logger.warn("No semantic matches in Pinecone. Running local text search.");
      return this.mockQuery(queryText, limit);
    } catch (error) {
      logger.error("Error querying Pinecone index. Falling back to local text search:", error.message);
      return this.mockQuery(queryText, limit);
    }
  },

  /**
   * Local text search similarity fallback.
   */
  mockQuery(queryText, limit = 2) {
    const terms = queryText.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const scored = mockDocuments.map(doc => {
      let score = 0;
      const text = doc.text.toLowerCase();
      for (const term of terms) {
        if (text.includes(term)) {
          score += 0.2;
        }
      }
      return { text: doc.text, score };
    });

    // Sort descending and return top matches
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  /**
   * Loads baseline documents, embeds them, and upserts them to Pinecone.
   */
  async upsertAstrologyDocuments() {
    if (!pineconeClient || !pineconeIndex) {
      logger.info("Pinecone not initialized. Skipping document upsert.");
      return;
    }

    try {
      logger.info("Embedding and indexing astrology reference documents in Pinecone...");
      const texts = mockDocuments.map(d => d.text);
      const embeddings = await embeddingService.embedDocuments(texts);

      const records = mockDocuments.map((doc, idx) => ({
        id: doc.id,
        values: embeddings[idx],
        metadata: { text: doc.text }
      }));

      await pineconeIndex.upsert(records);
      logger.info("Successfully indexed reference documents in Pinecone.");
    } catch (error) {
      logger.error("Error indexing documents in Pinecone:", error.message);
    }
  }
};
