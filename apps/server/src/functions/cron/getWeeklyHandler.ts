import fs from "fs";
import path from "path";
import { logger } from "logger";

import { getWeekInfo } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";
import { restaurantNames } from "@zotmeal/utils";

import { env } from "../env";

const isProduction = process.env.NODE_ENV === "production";
const connectionString = env.DATABASE_URL;
const sslConfig = isProduction
  ? {
      rejectUnauthorized: false,
      ca: fs.readFileSync(
        path.join(__dirname, "../../../certs", "global-bundle.pem").toString(),
      ),
    }
  : null;
export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({
      connectionString,
      ssl: sslConfig,
    });
    logger.info(`Start get weekly job...`);

    const results = await Promise.allSettled(
      restaurantNames.map(async (restaurant) =>
        getWeekInfo(db, new Date(), restaurant),
      ),
    );

    // log errors if any
    results.forEach((result) => {
      if (result.status === "rejected") {
        logger.error("getWeekInfo() failed:", result.reason);
      }
    });
  } catch (error) {
    logger.error("Failed to execute weekly task", error);
  } finally {
    await pool({ connectionString }).end();
    logger.info(`✅ Finished get weekly job.`);
  }
};
