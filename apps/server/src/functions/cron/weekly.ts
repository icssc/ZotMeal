import { logger } from "logger";

import { weekly } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";

import { env } from "../env";
import { ssl } from "../ssl";

const connectionString = env.DATABASE_URL;

export const main = async (_event, _context) => {
  try {
    logger.info(`Start get weekly job...`);
    const db = createDrizzle({
      connectionString,
      ssl,
    });
    await weekly(db);
  } catch (error) {
    logger.error(error, "Failed to execute weekly task.");
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info(`Finished get weekly job.`);
  }
};
