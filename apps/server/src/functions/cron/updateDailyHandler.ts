import { format } from "date-fns";

import {
  updateDaily,
  UpdateDailyParams,
} from "@zotmeal/api/src/services/updateDaily";
import { createDrizzle, pool } from "@zotmeal/db";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

import { logger } from "../../../logger";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://admin:admin@localhost:5434/zotmeal";

export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({ connectionString });
    logger.info("Start update daily job...");

    const date = format(new Date(), "MM/dd/yyyy");

    await Promise.allSettled(
      Object.keys(RESTAURANT_TO_ID).map((restaurantName) =>
        updateDaily(db, {
          date,
          restaurantName,
        } satisfies UpdateDailyParams),
      ),
    );

    logger.info("Finished update daily job.");
  } catch (error) {
    logger.error("Failed to execute weekly task", error);
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
  }
};
