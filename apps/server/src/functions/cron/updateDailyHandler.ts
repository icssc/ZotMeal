import { format } from "date-fns";

import {
  updateDaily,
  UpdateDailyParams,
} from "@zotmeal/api/src/services/updateDaily";
import { createDrizzle, pool } from "@zotmeal/db";
import { Restaurant } from "@zotmeal/db/src/schema";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://admin:admin@localhost:5434/zotmeal";

export const main = async (_event, _context) => {
  try {
    const db = await createDrizzle(connectionString);
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Start update daily job at ${formattedTime}`);

    const date = format(now, "MM/dd/yyyy");

    for (const restaurantName of Object.keys(
      RESTAURANT_TO_ID,
    ) as Restaurant["name"][]) {
      await updateDaily(db, {
        date,
        restaurantName,
      } satisfies UpdateDailyParams);
    }
    console.log("Finished update daily job.");
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  } finally {
    console.log("Closing connection pool...");
    await pool({ connectionString }).end();
    console.log("Closed connection pool.");
  }
};
