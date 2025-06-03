import { writeFileSync } from "fs";
import { upsertDish, upsertDishToMenu } from "@api/dishes/services";
import { logger } from "@api/logger";
import { upsertMenu } from "@api/menus/services";
import { upsertPeriod } from "@api/periods/services";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";

import type { Drizzle, RestaurantName } from "@zotmeal/db";
import type { CampusDishMenu, CampusDishPeriodResult } from "@zotmeal/validators";
import { getRestaurantId } from "@zotmeal/db";
import { CampusDishMenuSchema, PeriodSchema } from "@zotmeal/validators";
import { isNotEmptyString } from "testcontainers/build/common";


/** Fetch the CampusDish menu for a given date. */
export async function getCampusDishMenu(
  date: Date,
  restaurantName: RestaurantName,
  periodId?: string,
): Promise<CampusDishMenu> {
  const res: AxiosResponse = await axios.get(
    `https://uci-campusdish-com.translate.goog/api/menu/GetMenus`,
    {
      params: {
        locationId: getRestaurantId(restaurantName),
        date: format(date, "MM/dd/yyyy"),
        periodId,
      },
    },
  );

  // Step 1: Transform all keys in the response to PascalCase.
  let processedData: any = transformKeysToPascalCase(res.data);

  // Step 2: Specifically unify filter names within each Product's 
  // AvailableFilters object.
  // The CampusDish API provides filter keys in various formats 
  // (e.g., "Milk", "ContainsMilk").
  // This ensures they are consistently prefixed with "Contains" 
  // (e.g., "ContainsEggs").
  if (processedData.Menu && processedData.Menu.MenuProducts && Array.isArray(processedData.Menu.MenuProducts)) {
    processedData.Menu.MenuProducts.forEach((menuProduct: any) => {
      if (menuProduct.Product && menuProduct.Product.AvailableFilters 
          && typeof menuProduct.Product.AvailableFilters === 'object' 
          && menuProduct.Product.AvailableFilters !== null) {
        menuProduct.Product.AvailableFilters = 
          unifyFilterNames(menuProduct.Product.AvailableFilters);
      }
    });
  }

  if (process.env.IS_LOCAL) {
    const outPath = `./${restaurantName}-${format(date, "MM-dd-yyyy")}-${periodId}-res.json`;
    writeFileSync(outPath, JSON.stringify(processedData), { flag: "w" });
    logger.info(`Wrote CampusDish response to ${outPath}.`);
  }
  return CampusDishMenuSchema.parse(processedData);
}


/** Transforms a string to PascalCase. */
function toPascalCase(str: string): string {
  return str
    .replace(/_(\w)/g, (_, c) => c.toUpperCase())
    .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (firstChar) => firstChar.toUpperCase());
}


/** Changes all of the keys from the API response to title case. */
function transformKeysToPascalCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => transformKeysToPascalCase(item));
  }

  if (typeof data === 'object' && data !== null) {
    const newObject: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const newKey = toPascalCase(key);
        newObject[newKey] = transformKeysToPascalCase(data[key]);
      }
    }
    return newObject;
  }

  return data;
}


/** Unifies the response data names for available filters. */
function unifyFilterNames(filters: Record<string, any>): Record<string, any> {
  const unifiedFilters: Record<string, any> = {};
  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      let newKey = key;
      // If the key doesn't start with "Contains" (case-insensitive)
      if (!/^Contains/i.test(key)) {
        // Convert to PascalCase (e.g., "eggs" -> "Eggs") first, then prepend "Contains"
        const pascalKey = toPascalCase(key);
        newKey = `Contains${pascalKey}`;
      }
      unifiedFilters[newKey] = filters[key];
    }
  }
  return unifiedFilters;
}

/** Fetch the CampusDish period times for a given date. */
export async function getCampusDishPeriods(
  date: Date,
  restaurantName: RestaurantName
): Promise<CampusDishPeriodResult> {
  const res = await axios.get(
    "https://uci.campusdish.com/api/menu/GetMenuPeriods",
    {
      params: {
        locationId: getRestaurantId(restaurantName),
        date: format(date, "MM/dd/yyyy"),
        mode: "Daily"
      }
    }
  );
  
  //Normalize the timestamps by removing the milliseconds.
  res.data.Time = res.data.Time.split('T')[1].split('.')[0];
  res.data.Result.forEach((period: any) => {
    period.UtcMealPeriodStartTime = period.UtcMealPeriodStartTime.split('T')[1].split('.')[0];
    period.UtcMealPeriodEndTime = period.UtcMealPeriodEndTime.split('T')[1].split('.')[0];
  });

  return PeriodSchema.parse(res.data);
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
      logger.error(`Failed to parse CampusDish menu for ${restaurantName}.`);
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

  // Insert all stations. CampusDish returns a station for each period even 
  // though the station is the same for all periods.
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

  // Fetch periods and map them by periodId
  const periodsFetched = await getCampusDishPeriods(
    date,
    restaurantName
  ).catch(
    (e) => {
      logger.error(`Failed to parse CampusDish periods for ${restaurantName}.`);
      if (process.env.IS_LOCAL) {
        const outPath = `./${restaurantName}-${format(date, "MM-dd-yyyy")}-error.json`;
        writeFileSync(outPath, JSON.stringify(e), { flag: "w" });
        throw new Error(
          `Failed to parse CampusDish periods. Wrote validation error to ${outPath}.`,
        );
      }
      throw e;
    },
  );
;

  const periodsMap: {[periodId: number] : [string, string]} = {};

  periodsFetched.Result.forEach(periodObj => {
    periodsMap[periodObj.PeriodId] = 
      [periodObj.UtcMealPeriodStartTime, periodObj.UtcMealPeriodEndTime];
  });
  
  const formattedDateForDb = format(date, "yyyy-MM-dd");


  // Upsert all periods and menus for the given date 
  // (e.g. breakfast, lunch, dinner)
  const menuResult = await Promise.allSettled(
    menuAtDate.Menu.MenuPeriods.map(async (period) => {
      let periodInfo = periodsMap[Number(period.PeriodId)];

      await upsertPeriod(db, {
        id: period.PeriodId,
        date: formattedDateForDb,
        name: period.Name,
        startTime: periodInfo![0],
        endTime: periodInfo![1],
      });

      const menuAtPeriod = await getCampusDishMenu(
        date,
        restaurantName,
        period.PeriodId,
      );

      if (menuAtPeriod.SelectedPeriodId !== period.PeriodId)
        throw new Error("SelectedPeriodId should match periodId");

      // e.g. "3314|2022-01-01|107"
      const menuIdHash = 
        `${menuAtPeriod.LocationId}|${menuAtPeriod.Date}|${period.PeriodId}`;

      await upsertMenu(db, {
        id: menuIdHash,
        periodId: period.PeriodId,
        date: formattedDateForDb,
        price: "13.75", // TODO: add menu price to response
        restaurantId,
      });


      // Store all dishes to its table and join table
      await Promise.all(
        menuAtPeriod.Menu.MenuProducts.map(async (menuProduct) => {
          // Get the nutritional information from the NutritionTree
          let nutritionalInfo: {[nutrition : string] : string | null} = {};

          menuProduct.Product.NutritionalTree.forEach(nutrition => {
            nutritionalInfo[nutrition.Name] = nutrition.Value;

            if (nutrition.SubList != null && nutrition.SubList.length > 0) {
              nutrition.SubList.forEach(subNutrition => {
                nutritionalInfo[subNutrition!.Name] = subNutrition.Value;
              })
            }
          });

          await upsertDish(db, {
            id: menuProduct.ProductId,
            stationId: menuProduct.StationId,
            name: menuProduct.Product.MarketingName,
            description: menuProduct.Product.ShortDescription,
            category: menuProduct.Product.Categories?.[0]?.DisplayName,
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
            ingredients: menuProduct.Product.IngredientStatement,
            nutritionInfo: {
              dishId: menuProduct.ProductId,
              servingSize: menuProduct.Product.ServingSize,
              servingUnit: menuProduct.Product.ServingUnit,
              calories: menuProduct.Product.Calories,
              totalFatG: nutritionalInfo["Total Fat"],
              transFatG: nutritionalInfo["Trans Fat"],
              saturatedFatG: nutritionalInfo["Saturated Fat"],
              cholesterolMg: nutritionalInfo["Cholesterol"],
              sodiumMg: nutritionalInfo["Sodium"],
              totalCarbsG: nutritionalInfo["Total Carbohydrates"],
              dietaryFiberG: nutritionalInfo["Dietary Fiber"],
              sugarsG: nutritionalInfo["Total Sugars"],
              proteinG: nutritionalInfo["Protein"],
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

  for (const menu of menuResult) { 
    if (menu.status === "rejected") {
      const reason = menu.reason;
      let errorDetails = "";
      if (reason instanceof Error) {
        errorDetails = reason.message; 
      } else if (reason && typeof reason === 'object' && 'value' in reason && reason.value && typeof reason.value === 'object' && 'name' in reason.value && typeof reason.value.name === 'string') {
        errorDetails = `for item '${reason.value.name}'`;
      } else {
        errorDetails = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed during period processing for ${restaurantName}: ${errorDetails}`,
        reason,
      );
    }
  }
}
