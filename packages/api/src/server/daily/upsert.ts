import { dietRestrictions, getRestaurantId, InsertDishWithRelations, type Drizzle, type RestaurantName } from "@zotmeal/db";
import { getAdobeEcommerceMenuDaily, getLocationInformation, restaurantUrlMap } from "./new-parse";
import { AllergenKeys, DiningHallInformation, PreferenceKeys, WeekTimes } from "@zotmeal/validators";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import { logger } from "@api/logger";
import { upsertPeriod } from "@api/periods/services";
import { format } from "date-fns";
import { upsertMenu } from "@api/menus/services";
import { upsertDish } from "@api/dishes/services";

/**
 * Upserts the menu for the date `date` for a restaurant.
 * @param db the Drizzle database instance
 * @param date the date for which to upsert the menu
 * @param restaurantName the restaurant to upsert the menu for ("brandywine", "anteatery")
 */
export async function upsertMenusForDate(
  db: Drizzle,
  date: Date,
  restaurantName: RestaurantName,
): Promise<void> {
  const restaurantId = getRestaurantId(restaurantName);
  const dateString = format(date, "yyyy-MM-dd");
  const dayOfWeek = date.getDay();

  // Get all the periods and stations available today.
  const restaurantInfo: DiningHallInformation = await getLocationInformation(
    restaurantUrlMap[restaurantName],
    "ASC",
  );

  await upsertRestaurant(db, {
    id: restaurantId,
    name: restaurantName
  });

  // Upsert all stations present today.
  const stationsResult = await Promise.allSettled(
    Object.keys(restaurantInfo.stationsInfo).map(uid =>
      upsertStation(db, {
        id: uid,
        restaurantId,
        name: restaurantInfo.stationsInfo[uid]!,
      })
    )
  );

  for (const station of stationsResult)
    if (station.status === "rejected") {
      const reason = station.reason;
      let stationDetail = "unknown station";
      if (reason && typeof reason === 'object' && 'value' in reason && reason.value && typeof reason.value === 'object' && 'name' in reason.value && typeof reason.value.name === 'string') {
        stationDetail = `station '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        stationDetail = `Error: ${reason.message}`;
      } else {
        stationDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert ${stationDetail} for ${restaurantName}.`,
        reason,
      );
    }

  // Upsert all periods present today.
  const periodsResult = await Promise.allSettled(
    restaurantInfo.mealPeriods.map(period =>
      upsertPeriod(db, {
        id: period.id.toString(),
        date: dateString,
        name: period.name,
        startTime: period.openHours[dayOfWeek]!,
        endTime: period.closeHours[dayOfWeek]!
      })
    )
  );

  const menuResult = await Promise.allSettled(
    restaurantInfo.mealPeriods.map(async period => {
      const currentPeriodMenu = await getAdobeEcommerceMenuDaily(
        date,
        restaurantName,
        period.id.toString(),
      );

      const menuIdHash = 
        `${restaurantId}|${dateString}|${period.id}`;
      
      await upsertMenu(db, {
        id: menuIdHash,
        periodId: period.id.toString(),
        date: dateString,
        price: "???", // NOTE: Not sure if this was ever provided in the API..
        restaurantId
      });

      await Promise.all(
        currentPeriodMenu.map(dish => {
          let baseDietRestriction = {} as Omit<InsertDishWithRelations["dietRestriction"], "dishId" | "createdAt" | "updatedAt">;

          AllergenKeys.forEach(key => {
            const containsKey = 
              `contains_${key.replaceAll(" ", "_").toLowerCase()}` as keyof typeof baseDietRestriction;
            const allergenCode: number 
              = restaurantInfo.allergenIntoleranceCodes[key] ?? -1;

            baseDietRestriction[containsKey] = dish.recipeAllergenCodes.has(allergenCode);
          });

          PreferenceKeys.forEach(key => {
            const isKey = 
              `is_${key.replaceAll(" ", "_").toLowerCase()}` as keyof typeof baseDietRestriction;
            const preferenceCode: number 
              = restaurantInfo.menuPreferenceCodes[key] ?? -1;

            baseDietRestriction[isKey] = dish.recipePreferenceCodes.has(preferenceCode);
          });

          let dietRestriction: InsertDishWithRelations["dietRestriction"] = {
            dishId: dish.id,
            ...baseDietRestriction
          };

          upsertDish(db, {
            ...dish,
            menuId: menuIdHash,
            dietRestriction,
            nutritionInfo: dish.nutritionInfo,
          })
        })
      )
    })
  )
}