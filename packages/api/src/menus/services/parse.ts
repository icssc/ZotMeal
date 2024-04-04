import type { Drizzle } from "@zotmeal/db";
import type { DietRestriction, DishWithRelations, Menu, MenuPeriod, NutritionInfo, Restaurant, Station } from "@zotmeal/db/src/schema";
import { MenuPeriodSchema, MenuSchema } from "@zotmeal/db/src/schema";
import {
  getPeriodId,
  getRestaurantId,
  getRestaurantNameById,
} from "@zotmeal/utils";
import type { CampusDishResponse } from "@zotmeal/validators";
import { CampusDishResponseSchema } from "@zotmeal/validators";
import axios from "axios";
import { ZodError } from "zod";
import { upsertDish } from "../../dishes";
import { upsertRestaurant } from "../../restaurants/services/restaurant";
import { upsertStation } from "../../stations/station";
import { upsertMenu } from "./menu";
import { upsertPeriod } from "./menu-period";

interface GetMenuParams {
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
      console.log(e.issues);
    }
    console.log(e);
    throw e;
  }
}

export async function parseCampusDish(
  db: Drizzle,
  response: CampusDishResponse,
): Promise<void> {
  if (!getRestaurantNameById(response.LocationId)) {
    throw Error("restaurant id not found");
  }
  const restaurant: Restaurant = {
    id: response.LocationId,
    name: getRestaurantNameById(response.LocationId)!,
  };

  await upsertRestaurant(db, restaurant);
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
    });
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

  const menus: Menu[] = response.Menu.MenuPeriods.map((menuPeriod) => {
    const menu = MenuSchema.parse({
      id: menuPeriod.PeriodId,
      restaurantId: restaurant.id,
      period: menuPeriod.Name.toLowerCase(),
      start: menuPeriod.UtcMealPeriodStartTime,
      end: menuPeriod.UtcMealPeriodEndTime,
    });
    return menu;
  });

  for (const menu of menus) {
    await upsertMenu(db, menu);
  }

  // collect by stations
  // dishes by station id

  const dishes: DishWithRelations[] = response.Menu.MenuProducts.map((menuProduct) => {
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
    };

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
    };

    return {
      id: MenuProductId,
      stationId: StationId,
      name: Product.MarketingName,
      description: Product.ShortDescription,
      category: Product.Categories?.[0]?.DisplayName ?? "Other", // category is other if not specified
      dietRestriction,
      nutritionInfo,
    };
  });

  for (const dish of dishes) {
    await upsertDish(db, dish); // should nullcheck and throw for rollbacks
  }

  const stations: Station[] = response.Menu.MenuStations.map(
    (menuStation) => {
      return {
        id: menuStation.StationId,
        restaurantId: restaurant.id,
        menuId: response.Menu.MenuId,
        name: menuStation.Name,
      };
    },
  );

  for (const station of stations) {
    await upsertStation(db, station);
  }
}
