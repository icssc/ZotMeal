import { dietRestrictions, getRestaurantId, InsertDishWithRelations, type Drizzle, type RestaurantName } from "@zotmeal/db";
import { getAdobeEcommerceMenuDaily, getLocationInformation, restaurantUrlMap } from "./parse";
import { AllergenKeys, DiningHallInformation, PreferenceKeys, WeekTimes } from "@zotmeal/validators";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import { logger } from "@api/logger";
import { upsertPeriod } from "@api/periods/services";
import { format } from "date-fns";
import { upsertMenu } from "@api/menus/services";
import { upsertDish, upsertDishToMenu } from "@api/dishes/services";

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
    Object.keys(restaurantInfo.stationsInfo).map(id => {
      upsertStation(db, {
        id,
        restaurantId,
        name: restaurantInfo.stationsInfo[id]!,
      })
})
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
        `Failed to insert station ${stationDetail} for ${restaurantName}.`,
        reason,
      );
    }
  
  let relevantPeriods: number[] = []  // ids of periods available at this location today

  // Upsert all periods present today.
  const periodsResult = await Promise.allSettled(
    restaurantInfo.mealPeriods.map(period => {
      // only insert periods available at this location today
      if (period.openHours[dayOfWeek] && period.closeHours[dayOfWeek]) {
        relevantPeriods.push(period.id)
        upsertPeriod(db, {
          id: period.id.toString(),
          date: dateString,
          name: period.name,
          startTime: period.openHours[dayOfWeek],
          endTime: period.closeHours[dayOfWeek]
        })
      }
    })
  );

  for (const period of periodsResult)
    if (period.status === "rejected") {
      const reason = period.reason;
      let periodDetail = "unknown period";
      if (reason && typeof reason === 'object' && 'value' in reason && reason.value && typeof reason.value === 'object' && 'name' in reason.value && typeof reason.value.name === 'string') {
        periodDetail = `period '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        periodDetail = `Error: ${reason.message}`;
      } else {
        periodDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert period ${periodDetail} for ${restaurantName}.`,
        reason,
      );
    }

  const menuResult = await Promise.allSettled(
    relevantPeriods.map(async period => {
      const currentPeriodMenu = await getAdobeEcommerceMenuDaily(
        date,
        restaurantName,
        period,
      );

      const menuIdHash = 
        `${restaurantId}|${dateString}|${period}`;

      await upsertMenu(db, {
        id: menuIdHash,
        periodId: period.toString(),
        date: dateString,
        price: "???", // NOTE: Not sure if this was ever provided in the API..
        restaurantId
      });

      await Promise.all(
        currentPeriodMenu.map(async dish => {
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

          // remove sets from dish before upserting
          const { recipeAllergenCodes, recipePreferenceCodes, ...currentDish } = dish;
          
          await upsertDish(db, {
            ...currentDish,
            menuId: menuIdHash,
            dietRestriction,
            nutritionInfo: dish.nutritionInfo,
          })

          await upsertDishToMenu(db, {
            dishId: dish.id,
            menuId: menuIdHash
          })
        })
      )
    })
  );

  for (const menu of menuResult)
    if (menu.status === "rejected") {
      const reason = menu.reason;
      let menuDetail = "unknown menu";
      if (reason && typeof reason === 'object' && 'value' in reason && reason.value && typeof reason.value === 'object' && 'name' in reason.value && typeof reason.value.name === 'string') {
        menuDetail = `menu '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        menuDetail = `Error: ${reason.message}`;
      } else {
        menuDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert menu ${menuDetail} for ${restaurantName}.`,
        reason,
      );
    }
}