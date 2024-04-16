import { format } from "date-fns";

import {
  getWeekInfo,
  GetWeekInfoParams,
} from "@zotmeal/api/src/services/getWeekInfo";
import { createDrizzle } from "@zotmeal/db";
import { Restaurant } from "@zotmeal/db/src/schema";

import { RESTAURANT_NAMES } from "../../../../../packages/utils/src/constants";

export const main = async (event, context) => {
  try {
    const db = await createDrizzle(process.env.DATABASE_URL);

    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");
    for (const restaurant of RESTAURANT_NAMES) {
      await getWeekInfo(db, {
        date: formattedDate,
        restaurantName: restaurant as Restaurant["name"],
      } satisfies GetWeekInfoParams);
    }
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
