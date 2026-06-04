import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../utils/logger.js";
import { runEphemeris } from "../utils/ephemerisRunner.js";

/**
 * compute_birth_chart tool definition.
 * Generates planetary alignments and houses for a geocoded natal chart using Swiss Ephemeris.
 */
export const compute_birth_chart = tool(
  async ({ date, time, latitude, longitude, timezone }) => {
    logger.info(`Tool compute_birth_chart executing for date: ${date}, time: ${time}`);

    try {
      const chartResult = await runEphemeris("chart", date, time, latitude, longitude, timezone);
      
      const sunSign = chartResult.placements.Sun.sign;
      const moonSign = chartResult.placements.Moon.sign;
      const ascSign = chartResult.ascendant.sign;

      return JSON.stringify({
        inputs: chartResult.inputs,
        placements: chartResult.placements,
        houses: chartResult.houses,
        ascendant: chartResult.ascendant,
        midheaven: chartResult.midheaven,
        summary: `Natal chart computed successfully. Ascendant is ${ascSign} (${chartResult.ascendant.degree}°), Sun is in ${sunSign} (${chartResult.placements.Sun.degree}°), Moon is in ${moonSign} (${chartResult.placements.Moon.degree}°).`
      });
    } catch (err) {
      logger.error(`Error computing birth chart: ${err.message}`);
      return JSON.stringify({
        error: `Could not calculate natal chart: ${err.message}`
      });
    }
  },
  {
    name: "compute_birth_chart",
    description: "Computes the positions of the planets and houses (Ascendant, Sun, Moon, etc.) for a specific date, time, and geocoded coordinates.",
    schema: z.object({
      date: z.string().describe("The birth date in YYYY-MM-DD format"),
      time: z.string().describe("The birth time in HH:MM format (24-hour clock)"),
      latitude: z.number().describe("Latitude of the birth location from geocoding"),
      longitude: z.number().describe("Longitude of the birth location from geocoding"),
      timezone: z.string().describe("IANA Timezone of the birth location (e.g. America/New_York)")
    })
  }
);

