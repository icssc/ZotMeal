import { dietRestrictions, getRestaurantId, InsertDishWithRelations, type Drizzle, type RestaurantName } from "@zotmeal/db";
import { AllergenKeys, DiningHallInformation, PreferenceKeys, WeekTimes } from "@zotmeal/validators";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import { logger } from "@api/logger";
import { upsertPeriod } from "@api/periods/services";
import { format } from "date-fns";
import { upsertMenu } from "@api/menus/services";
import { upsertDish, upsertDishToMenu } from "@api/dishes/services";
import { restaurantUrlMap, getLocationInformation } from "../daily/parse";

/**
 * Upserts the menu for the week starting at `date` for a restaurant.
 * @param db the Drizzle database instance
 * @param date the date for which to upsert the menu
 * @param restaurantName the restaurant to upsert the menu for ("brandywine", "anteatery")
*/
export async function upsertMenusForWeek(
  db: Drizzle,
  date: Date,
  restaurantName: RestaurantName,
): Promise<void> {
  const restaurantId = getRestaurantId(restaurantName);
  const dateString = format(date, "yyyy-MM-dd");
  const dayOfWeek = date.getDay();

  const restaurantInfo: DiningHallInformation = await getLocationInformation(
    restaurantUrlMap[restaurantName],
    "ASC",
  );

  await upsertRestaurant(db, {
    id: restaurantId,
    name: restaurantName
  });

}