import { format } from "date-fns";

import { getWeekInfo } from "@zotmeal/api/src/services/getWeekInfo";
import { RESTAURANT_NAMES } from "../../../../../packages/utils/src/constants";
import { db } from "@zotmeal/db"

export const main = async (event, context) => {
  try {
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");
    for (const restaurant of RESTAURANT_NAMES) {
      await getWeekInfo(db, 
        {
          date: formattedDate,
          restaurantName: restaurant
        }
      );
    }
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
