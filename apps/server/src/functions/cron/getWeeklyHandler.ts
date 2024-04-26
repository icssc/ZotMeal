import { format } from "date-fns";

import {
  getWeekInfo,
  GetWeekInfoParams,
} from "@zotmeal/api/src/services/getWeekInfo";
import { createDrizzle, pool } from "@zotmeal/db";
import { Restaurant } from "@zotmeal/db/src/schema";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://admin:admin@localhost:5434/zotmeal";

export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({ connectionString });

    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");

    const results = await Promise.allSettled(
      Object.keys(RESTAURANT_TO_ID).map(async (restaurant) => {
        getWeekInfo(db, {
          date: formattedDate,
          restaurantName: restaurant as Restaurant["name"],
        } satisfies GetWeekInfoParams);
      }),
    );

    // log errors if any
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error(result.reason);
      }
    });
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  } finally {
    await pool({ connectionString }).end();
  }
};
