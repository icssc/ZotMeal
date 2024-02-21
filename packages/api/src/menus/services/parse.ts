import axios from "axios";
import { ZodError } from "zod";

import type { Prisma, PrismaClient } from "@zotmeal/db";
import type { CampusDishResponse } from "@zotmeal/validators";
import {
  getPeriodId,
  getRestaurantId,
  getRestaurantNameById,
} from "@zotmeal/utils";
import { CampusDishResponseSchema } from "@zotmeal/validators";

import type {
  DietRestrictionParams,
  DishParams,
  NutritionInfoParams,
} from "../../dishes/models";
import type { RestaurantParams } from "../../restaurants/models";
import type { StationParams } from "../../stations/models";
import type {
  GetMenuParams,
  MenuParams,
  MenuPeriodParams,
} from "../models/menu";
import { saveDish } from "../../dishes";
import { saveRestaurant } from "../../restaurants/services/restaurant";
import { saveStation } from "../../stations/station";
import { MenuPeriodSchema, MenuSchema } from "../models/menu";
import { saveMenu } from "./menu";
import { savePeriod } from "./menu-period";

export async function parseMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetMenuParams,
) {
  const { date, restaurant, period } = params;

  const periodId = getPeriodId(period);

  if (!periodId) {
    console.error("invalid period", period);
    return null;
  }

  const restaurantId = getRestaurantId(restaurant);

  // const res = await axios.get(
  //   "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
  // );

  const res = await axios.get(
    `https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=${restaurantId}&periodId=${periodId}&date=${date}`,
  );

  try {
    const validated = CampusDishResponseSchema.parse(res.data);
    await parseCampusDish(db, validated);
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.issues);
    }
    console.log(e);
    throw e;
  }
}

export async function parseCampusDish(
  db: PrismaClient | Prisma.TransactionClient,
  response: CampusDishResponse,
) {
  if (getRestaurantNameById(response.LocationId) === null) {
    throw Error("restaurant id not found");
  }
  const restaurant: RestaurantParams = {
    id: response.LocationId,
    name: getRestaurantNameById(response.LocationId)!,
  };

  await saveRestaurant(db, restaurant);
  let menuPeriods: MenuPeriodParams[];
  try {
    menuPeriods = response.Menu.MenuPeriods.map((menuPeriod) => {
      const period = MenuPeriodSchema.parse({
        id: menuPeriod.PeriodId,
        name: menuPeriod.Name.toLowerCase(),
        start: menuPeriod.UtcMealPeriodEndTime,
        end: menuPeriod.UtcMealPeriodEndTime,
      });
      return period;
    });
  } catch (e) {
    if (e instanceof ZodError) {
      console.error("MenuPeriods", e.issues);
    }
    throw e;
  }

  // Promise.all optimize
  for (const period of menuPeriods) {
    await savePeriod(db, period);
  }

  const menus: MenuParams[] = response.Menu.MenuPeriods.map((menuPeriod) => {
    const menu = MenuSchema.parse({
      id: menuPeriod.PeriodId,
      period: menuPeriod.Name.toLowerCase(),
      start: menuPeriod.UtcMealPeriodStartTime,
      end: menuPeriod.UtcMealPeriodEndTime,
    });
    return menu;
  });

  for (const menu of menus) {
    await saveMenu(db, menu);
  }

  // collect by stations
  // dishes by station id

  const dishes: DishParams[] = response.Menu.MenuProducts.map((menuProduct) => {
    const { MenuProductId, StationId, Product } = menuProduct;
    const dietRestriction: DietRestrictionParams = {
      containsEggs: Product.ContainsEggs,
      containsFish: Product.ContainsFish,
      containsMilk: Product.ContainsMilk,
      containsPeanuts: Product.ContainsPeanuts,
      containsShellfish: Product.ContainsShellfish,
      containsSoy: Product.ContainsSoy,
      containsTreeNuts: Product.ContainsTreeNuts,
      containsWheat: Product.ContainsWheat,
      containsSesame: Product.ContainsSesame,
      isGlutenFree: Product.IsGlutenFree,
      isHalal: Product.IsHalal,
      isKosher: Product.IsKosher,
      isLocallyGrown: Product.IsLocallyGrown,
      isOrganic: Product.IsOrganic,
      isVegan: Product.IsVegan,
      isVegetarian: Product.IsVegetarian,
    };

    const nutritionInfo: NutritionInfoParams = {
      servingSize: Product.ServingSize,
      servingUnit: Product.ServingUnit,
      calories: Product.Calories,
      caloriesFromFat: Product.CaloriesFromFat,
      totalFat: Product.TotalFat,
      transFat: Product.TransFat,
      cholesterol: Product.Cholesterol,
      sodium: Product.Sodium,
      totalCarbohydrates: Product.TotalCarbohydrates,
      dietaryFiber: Product.DietaryFiber,
      sugars: Product.Sugars,
      protein: Product.Protein,
      vitaminA: Product.VitaminA,
      vitaminC: Product.VitaminC,
      calcium: Product.Calcium,
      iron: Product.Iron,
      saturatedFat: Product.SaturatedFat,
    };

    return {
      id: MenuProductId,
      stationId: StationId,
      name: Product.MarketingName,
      description: Product.ShortDescription,
      dietRestriction,
      nutritionInfo,
    };
  });

  for (const dish of dishes) {
    await saveDish(db, dish);
  }

  const stations: StationParams[] = response.Menu.MenuStations.map(
    (menuStation) => {
      return {
        id: menuStation.StationId,
        restaurantId: restaurant.id,
        name: menuStation.Name,
      };
    },
  );

  for (const station of stations) {
    await saveStation(db, station);
  }
}
