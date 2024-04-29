import { format } from "date-fns";
import { logger } from "logger";

import { getWeekInfo } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";
import { restaurantNames } from "@zotmeal/utils";

const connectionString = process.env.DATABASE_URL;

export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({ connectionString });

    logger.info(`Start get weekly job...`);

    const date = format(new Date(), "MM/dd/yyyy");

    const results = await Promise.allSettled(
      restaurantNames.map(async (restaurantName) =>
        getWeekInfo(db, { date, restaurantName }),
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
