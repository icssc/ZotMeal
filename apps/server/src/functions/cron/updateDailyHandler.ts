import { format } from "date-fns";

import { updateDaily } from "@zotmeal/api/src/services/updateDaily";
import { RestaurantSchema } from "@zotmeal/db/src/schema";

export const main = async (event, context) => {
  try {
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");
    updateDaily(context, 
      {date: formattedDate,
        restaurantName: RestaurantSchema.shape.name.Enum.anteatery
      }
    );
    updateDaily(context, 
      {date: formattedDate,
        restaurantName: RestaurantSchema.shape.name.Enum.brandywine
      }
    );

  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
