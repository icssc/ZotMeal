import fs from "fs";
import path from "path";

import { updateDaily } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";
import { restaurantNames } from "@zotmeal/utils";

import { logger } from "../../../logger";
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
    logger.info("Start update daily job...");

    await Promise.allSettled(
      restaurantNames.map((restaurant) =>
        updateDaily(db, new Date(), restaurant),
      ),
    );
  } catch (error) {
    logger.error("Failed to execute weekly task", error);
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info("✅ Finished update daily job.");
  }
};
