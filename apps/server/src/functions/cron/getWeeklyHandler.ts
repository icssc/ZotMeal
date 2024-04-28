import { format } from "date-fns";
import { logger } from "logger";

import { getWeekInfo } from "@zotmeal/api/src/services/getWeekInfo";
import { createDrizzle, pool } from "@zotmeal/db";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

const connectionString = process.env.DATABASE_URL;

export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({ connectionString });

    logger.info(`Start get weekly job...`);

    const date = format(new Date(), "MM/dd/yyyy");

    const results = await Promise.allSettled(
      Object.keys(RESTAURANT_TO_ID).map(async (restaurantName) =>
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
