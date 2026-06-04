import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../utils/logger.js";
import { runEphemeris } from "../utils/ephemerisRunner.js";

/**
 * get_daily_transits tool definition.
 * Retrieves current planetary aspects and transits for a location.
 */
export const get_daily_transits = tool(
  async ({ date, latitude, longitude }) => {
    logger.info(`Tool get_daily_transits executing for date: ${date}`);

    try {
      // Use midday 12:00 UTC as default transit calculation time
      const transitResult = await runEphemeris("transit", date, "12:00", latitude, longitude, "UTC");
      
      const placements = transitResult.placements;
      const isMercuryRetro = placements.Mercury.isRetrograde;
      const isSaturnRetro = placements.Saturn.isRetrograde;
      const isMarsRetro = placements.Mars.isRetrograde;

      const highlights = [
        isMercuryRetro 
          ? `Mercury is Retrograde in ${placements.Mercury.sign} at ${placements.Mercury.degree}°. Communication, technology, and travel planning require extra caution and patience.`
          : `Mercury is Direct in ${placements.Mercury.sign} at ${placements.Mercury.degree}°, promoting clear and active messaging and logic.`,
        isSaturnRetro
          ? `Saturn is Retrograde in ${placements.Saturn.sign} at ${placements.Saturn.degree}°, prompting structural reviews of our dreams, subconscious boundaries, and spiritual discipline.`
          : `Saturn is Direct in ${placements.Saturn.sign} at ${placements.Saturn.degree}°, assisting with discipline and steady growth.`,
        `Mars is in ${placements.Mars.sign} at ${placements.Mars.degree}°${isMarsRetro ? " (Retrograde)" : ""}, fueling passion, energy, and drive.`
      ];

      return JSON.stringify({
        date,
        coordinates: { latitude, longitude },
        transits: placements,
        highlights
      });
    } catch (err) {
      logger.error(`Error calculating daily transits: ${err.message}`);
      return JSON.stringify({
        error: `Could not calculate daily transits: ${err.message}`
      });
    }
  },
  {
    name: "get_daily_transits",
    description: "Gets the current planetary placements and transits for a specific date and location.",
    schema: z.object({
      date: z.string().describe("The date to fetch transits for in YYYY-MM-DD format"),
      latitude: z.number().describe("Latitude of the query location"),
      longitude: z.number().describe("Longitude of the query location")
    })
  }
);

