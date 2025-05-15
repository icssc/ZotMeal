import { writeFileSync } from "fs";
import { upsertDish, upsertDishToMenu } from "@api/dishes/services";
import { logger } from "@api/logger";
import { upsertMenu } from "@api/menus/services";
import { upsertPeriod } from "@api/periods/services";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import axios from "axios";
import { format } from "date-fns";

import type { Drizzle, RestaurantName } from "@zotmeal/db";
import type { CampusDishMenu } from "@zotmeal/validators";
import { getRestaurantId } from "@zotmeal/db";
import { CampusDishMenuSchema } from "@zotmeal/validators";

/** Fetch the CampusDish menu for a given date. */
export async function getCampusDishMenu(
  date: Date,
  restaurantName: RestaurantName,
  periodId?: string,
): Promise<CampusDishMenu> {
  const res = await axios.get(
    `https://uci-campusdish-com.translate.goog/api/menu/GetMenus`,
    {
      params: {
        locationId: getRestaurantId(restaurantName),
        date: format(date, "MM/dd/yyyy"),
        periodId,
      },
    },
  );
  if (process.env.IS_LOCAL) {
    const outPath = `./${restaurantName}-${format(date, "MM-dd-yyyy")}-${periodId}-res.json`;
    writeFileSync(outPath, JSON.stringify(res.data), { flag: "w" });
    logger.info(`Wrote CampusDish response to ${outPath}.`);
  }
  return CampusDishMenuSchema.parse(res.data);
}

/** Upsert menus for a given date. */
export async function upsertMenusForDate(
  db: Drizzle,
  date: Date,
  restaurantName: RestaurantName,
): Promise<void> {
  const restaurantId = getRestaurantId(restaurantName);

  // Get the menu for the given date to first get all the periods and stations.
  const menuAtDate = await getCampusDishMenu(date, restaurantName).catch(
    (e) => {
      logger.error(`❌ Failed to parse CampusDish menu for ${restaurantName}.`);
      if (process.env.IS_LOCAL) {
        const outPath = `./${restaurantName}-${format(date, "MM-dd-yyyy")}-error.json`;
        writeFileSync(outPath, JSON.stringify(e), { flag: "w" });
        throw new Error(
          `Failed to parse CampusDish menu. Wrote validation error to ${outPath}.`,
        );
      }
      throw e;
    },
  );

  await upsertRestaurant(db, {
    id: restaurantId,
    name: restaurantName,
  });

  // Insert all stations. CampusDish returns a station for each period even though the station is the same for all periods.
  // Right now we're just going to insert the station once for each period.
  const stationResult = await Promise.allSettled(
    menuAtDate.Menu.MenuStations.map((station) =>
      upsertStation(db, {
        id: station.StationId,
        restaurantId,
        name: station.Name,
      }),
    ),
  );

  for (const station of stationResult)
    if (station.status === "rejected")
      logger.error(
        station.reason,
        `❌ Failed to insert station ${station.reason.value.name} for ${restaurantName}:`,
      );

  // Upsert all periods and menus for the given date (e.g. breakfast, lunch, dinner)
  // TODO: Get start and end times through separate query
  const menuResult = await Promise.allSettled(
    menuAtDate.Menu.MenuPeriods.map(async (period) => {
      await upsertPeriod(db, {
        id: period.PeriodId,
        name: period.Name,
        // startTime: period.UtcMealPeriodStartTime,
        // endTime: period.UtcMealPeriodEndTime,
      });

      const menuAtPeriod = await getCampusDishMenu(
        date,
        restaurantName,
        period.PeriodId,
      );

      if (menuAtPeriod.SelectedPeriodId !== period.PeriodId)
        throw new Error("SelectedPeriodId should match periodId");

      // e.g. "3314|2022-01-01|107"
      const menuIdHash = `${menuAtPeriod.LocationId}|${menuAtPeriod.Date}|${period.PeriodId}`;

      await upsertMenu(db, {
        id: menuIdHash,
        periodId: period.PeriodId,
        date: menuAtDate.Date,
        price: "13.75", // TODO: add menu price to response
        restaurantId,
      });

      // Store all dishes to its table and join table
      await Promise.all(
        menuAtPeriod.Menu.MenuProducts.map(async (menuProduct) => {
          await upsertDish(db, {
            id: menuProduct.ProductId,
            stationId: menuProduct.StationId,
            name: menuProduct.Product.MarketingName,
            description: menuProduct.Product.ShortDescription,
            category: menuProduct.Product.Categories?.[0]?.DisplayName,
            dietaryInformation: {
              
            },
            dietRestriction: {
              dishId: menuProduct.ProductId,
              containsEggs: menuProduct.Product.AvailableFilters.ContainsEggs,
              containsFish: menuProduct.Product.AvailableFilters.ContainsFish,
              containsMilk: menuProduct.Product.AvailableFilters.ContainsMilk,
              containsPeanuts: menuProduct.Product.AvailableFilters.ContainsPeanuts,
              containsShellfish: menuProduct.Product.AvailableFilters.ContainsShellfish,
              containsSoy: menuProduct.Product.AvailableFilters.ContainsSoy,
              containsTreeNuts: menuProduct.Product.AvailableFilters.ContainsTreeNuts,
              containsWheat: menuProduct.Product.AvailableFilters.ContainsWheat,
              containsSesame: menuProduct.Product.AvailableFilters.ContainsSesame,
            },
            nutritionInfo: {
              dishId: menuProduct.ProductId,
              servingSize: menuProduct.Product.ServingSize,
              servingUnit: menuProduct.Product.ServingUnit,
              calories: menuProduct.Product.Calories,
              totalFatG: menuProduct.Product.TotalFat,
              transFatG: menuProduct.Product.TransFat,
              cholesterolMg: menuProduct.Product.Cholesterol,
              sodiumMg: menuProduct.Product.Sodium,
              totalCarbsG: menuProduct.Product.TotalCarbohydrates,
              dietaryFiberG: menuProduct.Product.DietaryFiber,
              sugarsMg: menuProduct.Product.Sugars,
              proteinG: menuProduct.Product.Protein,
              vitaminAIU: menuProduct.Product.VitaminA,
              vitaminCIU: menuProduct.Product.VitaminC,
              calciumMg: menuProduct.Product.Calcium,
              ironMg: menuProduct.Product.Iron,
              saturatedFatG: menuProduct.Product.SaturatedFat,
            },
          });

          await upsertDishToMenu(db, {
            dishId: menuProduct.ProductId,
            menuId: menuIdHash,
          });
        }),
      );
    }),
  );

  for (const menu of menuResult)
    if (menu.status === "rejected")
      logger.error(
        menu.reason,
        `❌ Failed to insert menu ${menu.reason.value.name} for ${restaurantName}:`,
      );
}
