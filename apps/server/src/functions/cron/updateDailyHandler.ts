import { format } from "date-fns";

import {
  updateDaily,
  UpdateDailyParams,
} from "@zotmeal/api/src/services/updateDaily";
import { createDrizzle } from "@zotmeal/db";
import { Restaurant } from "@zotmeal/db/src/schema";

import { RESTAURANT_TO_ID } from "../../../../../packages/utils/src/constants";

const connectionString = process.env.DATABASE_URL

export const main = async (event, context) => {
  try {
    //
    console.log("Starting update daily");
    //
    const db = await createDrizzle(connectionString ??  "postgres://admin:admin@localhost:5434/zotmeal");
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Daily task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");

    for (const restaurant of Object.keys(RESTAURANT_TO_ID)) {
      await updateDaily(db, {
        date: formattedDate,
        restaurantName: restaurant as Restaurant["name"],
      } satisfies UpdateDailyParams);
    }
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
