import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, "ephemeris.py");

/**
 * Runs the Python swisseph calculation script and returns the parsed JSON.
 * @param {string} mode - 'chart' or 'transit'
 * @param {string} date - 'YYYY-MM-DD'
 * @param {string} time - 'HH:MM'
 * @param {number} latitude - Decimal degrees latitude
 * @param {number} longitude - Decimal degrees longitude
 * @param {string} timezone - IANA Timezone string (e.g. 'Europe/London')
 * @returns {Promise<object>} The calculated planetary positions and houses
 */
export const runEphemeris = (mode, date, time, latitude, longitude, timezone) => {
  return new Promise((resolve, reject) => {
    logger.info(`Running ephemeris calculations for mode=${mode}, date=${date}, time=${time}, lat=${latitude}, lng=${longitude}, tz=${timezone}`);
    
    // Spawn python process
    const child = spawn("python", [
      SCRIPT_PATH,
      mode,
      date,
      time,
      String(latitude),
      String(longitude),
      timezone
    ]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        logger.error(`Python ephemeris runner failed (exit code ${code}): ${stderr}`);
        reject(new Error(`Astronomical engine exited with error code ${code}: ${stderr.trim()}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        if (parsed.error) {
          reject(new Error(parsed.error));
        } else {
          resolve(parsed);
        }
      } catch (err) {
        logger.error(`Failed to parse ephemeris JSON output: ${err.message}. Raw output: "${stdout}"`);
        reject(new Error(`Failed to parse astronomical output data: ${err.message}`));
      }
    });

    child.on("error", (err) => {
      logger.error(`Failed to start python process: ${err.message}`);
      reject(new Error(`Failed to initialize astronomical engine: ${err.message}`));
    });
  });
};
