import { format } from "date-fns";

import { updateDaily, UpdateDailyParams } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";
import { restaurantNames } from "@zotmeal/utils";

import { logger } from "../../../logger";

const connectionString = process.env.DATABASE_URL;

export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({ connectionString });
    logger.info("Start update daily job...");

    const date = format(new Date(), "MM/dd/yyyy");

    await Promise.allSettled(
      restaurantNames.map((restaurantName) =>
        updateDaily(db, {
          date,
          restaurantName,
        } satisfies UpdateDailyParams),
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
