import axios from "axios";
import { ZodError } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type {
  DietRestriction,
  DishesToStations,
  DishWithRelations,
  Menu,
  MenuPeriod,
  NutritionInfo,
  Restaurant,
  Station,
  StationWithRelations,
} from "@zotmeal/db/src/schema";
import type { CampusDishResponse } from "@zotmeal/validators";
import { MenuPeriodSchema, MenuSchema } from "@zotmeal/db/src/schema";
import {
  getPeriodId,
  getRestaurantId,
  getRestaurantNameById,
} from "@zotmeal/utils";
import { CampusDishResponseSchema } from "@zotmeal/validators";

import { upsertDish, upsertDishToStationRelation } from "../../dishes";
import { upsertRestaurant } from "../../restaurants/services/restaurant";
import { upsertStation } from "../../stations";
import { upsertMenu } from "./menu";
import { upsertPeriod } from "./menu-period";

export interface GetMenuParams {
  date: string;
  period: MenuPeriod["name"];
  restaurant: Restaurant["name"];
}

export async function getCampusDish(
  params: GetMenuParams,
): Promise<CampusDishResponse | null> {
  const { date, restaurant, period } = params;

  const periodId = getPeriodId(period);

  if (!periodId) {
    console.error("invalid period", period);
    return null;
  }

  const restaurantId = getRestaurantId(restaurant);

  if (!restaurantId) {
    console.error("invalid restaurant", restaurant);
    return null;
  }

  // const res = await axios.get(
  //   "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
  // );

  const res = await axios.get(
    `https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=${restaurantId}&periodId=${periodId}&date=${date}`,
  );

  try {
    const validated = CampusDishResponseSchema.parse(res.data);
    return validated;
  } catch (e) {
    if (e instanceof ZodError) {
      console.error(e.issues);
    }
    console.error(e);
    throw e;
  }
}

export async function parseCampusDish(
  db: Drizzle,
  response: CampusDishResponse,
): Promise<void> {
  const restaurantName = getRestaurantNameById(response.LocationId);

  if (!restaurantName) {
    throw Error("restaurant id not found");
  }

  // insert restaurant
  const restaurant: Restaurant = {
    id: response.LocationId,
    name: restaurantName,
  } satisfies Restaurant;

  await upsertRestaurant(db, restaurant);

  // insert menuPeriods
  let menuPeriods: MenuPeriod[];
  try {
    menuPeriods = response.Menu.MenuPeriods.map((menuPeriod) => {
      const validPeriod = MenuPeriodSchema.parse({
        id: menuPeriod.PeriodId,
        name: menuPeriod.Name.toLowerCase(),
        start: menuPeriod.UtcMealPeriodEndTime,
        end: menuPeriod.UtcMealPeriodEndTime,
      });
      return validPeriod;
    }) satisfies MenuPeriod[];
  } catch (e) {
    if (e instanceof ZodError) {
      console.error("MenuPeriods", e.issues);
    }
    throw e;
  }

  // Promise.all optimize
  for (const period of menuPeriods) {
    await upsertPeriod(db, period);
  }

  // insert all menu
  const menu: Menu = MenuSchema.parse({
    id: restaurant.id + response.SelectedPeriodId + response.Date,
    restaurantId: restaurant.id,
    periodId: response.SelectedPeriodId,
    date: response.Date,
  }) satisfies Menu;

  await upsertMenu(db, menu);

  // insert station
  const stations: Station[] = response.Menu.MenuStations.map((menuStation) => {
    return {
      id: menuStation.StationId,
      restaurantId: restaurant.id,
      menuId: response.Menu.MenuId,
      name: menuStation.Name,
    };
  }) satisfies Station[];

  for (const station of stations) {
    await upsertStation(db, station);
  }

  // insert dishes
  // collect by stations
  // dishes by station id
  const dishes: DishWithRelations[] = response.Menu.MenuProducts.map(
    (menuProduct) => {
      const { MenuProductId, StationId, Product } = menuProduct;
      const dietRestriction: DietRestriction = {
        dishId: MenuProductId,
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
      } satisfies DietRestriction;

      const nutritionInfo: NutritionInfo = {
        dishId: MenuProductId,
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
      } satisfies NutritionInfo;

      return {
        id: MenuProductId,
        stationId: StationId,
        name: Product.MarketingName,
        description: Product.ShortDescription,
        category: Product.Categories?.[0]?.DisplayName ?? "Other", // category is other if not specified
        dietRestriction,
        nutritionInfo,
      } satisfies DishWithRelations;
    },
  );

  for (const dish of dishes) {
    await upsertDish(db, dish); // should nullcheck and throw for rollbacks
  }

  // insert the relations between stations and menus in the join table
}
