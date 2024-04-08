import { format } from "date-fns";

import { getWeekInfo } from "@zotmeal/api/src/services/getWeekInfo";
import { RestaurantSchema } from "@zotmeal/db/src/schema";

import { db } from "@zotmeal/db"

export const main = async (event, context) => {
  try {
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");
    getWeekInfo(db, 
      {
        date: formattedDate,
        restaurantName: RestaurantSchema.shape.name.Enum.anteatery
      }
    );
    getWeekInfo(db, 
      {
        date: formattedDate,
        restaurantName: RestaurantSchema.shape.name.Enum.brandywine
      }
    );
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
