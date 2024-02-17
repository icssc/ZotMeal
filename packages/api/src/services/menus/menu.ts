import axios from "axios";
import type { z } from "zod";
import { ZodError } from "zod";

import type { Prisma, PrismaClient } from "@zotmeal/db";
import {
  getPeriodId,
  getRestaurantId,
  getRestaurantById as getRestaurantNameById,
} from "@zotmeal/utils";
import type {
  CampusDishResponse,
  DietRestrictionSchema,
  NutritionInfoSchema,
  ParsedDish,
  ParsedResponse,
  ParsedStation,
} from "@zotmeal/validators";
import { CampusDishResponseSchema } from "@zotmeal/validators";

import type { MenuModel } from "../../models/menu";
import type { GetMenuParams } from "../../router/menu/get";
import { parseDate } from "../utils/date";
import { getRestaurant } from "../restaurants/restaurant";

export async function getMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetMenuParams,
): Promise<MenuModel | null> {
  const { date: dateString, period, restaurant: restaurantName } = params;

  const restaurant = await getRestaurant(db, restaurantName);
  if (restaurant === null) {
    console.error("restaurant not found: ", restaurantName);
    return null;
  }

  const date = parseDate(dateString);
  if (!date) {
    console.error("invalid date", dateString);
    return null;
  }

  const menu: MenuModel | null = await db.menu.findFirst({
    where: {
      restaurantId: restaurant.id,
      date,
      period,
    },
    include: {
      restaurant: true,
      stations: {
        include: {
          dishes: true,
        },
      },
    },
  });

  return menu;
}

export async function parseMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetMenuParams,
) /* : Promise<MenuModel | null> */ {
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
    return parseCampusDish(validated);
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.issues);
    }
    console.log(e);
    throw e;
  }
}

export function parseCampusDish(
  response: CampusDishResponse,
): ParsedResponse {
  if (!getRestaurantNameById(response.LocationId)) {
    throw Error("location id not found");
  }

  const menuPeriod = response
    .Menu
    .MenuPeriods
    .find((menuPeriod) => menuPeriod.PeriodId === response.SelectedPeriodId);

  if (!menuPeriod) {
    throw Error("period not found");
  }

  const uniqueStations = new Set<string>();
  response.Menu.MenuStations.forEach((menuStation) => {
    uniqueStations.add(
      JSON.stringify({
        id: menuStation.StationId,
        restaurantId: response.LocationId,
        name: menuStation.Name,
      }),
    );
  });

  const stations = Array.from(uniqueStations).map(
    (station) => JSON.parse(station) as ParsedStation,
  );

  const dishes = response.Menu.MenuProducts.map((menuProduct): ParsedDish => {
    type DietRestriction = z.infer<typeof DietRestrictionSchema>;

    const { Product, MenuProductId, StationId } = menuProduct;

    const dietRestriction: DietRestriction = {
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

    type NutritionInfo = z.infer<typeof NutritionInfoSchema>;
    const nutritionInfo: NutritionInfo = {
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

  const name = getRestaurantNameById(response.LocationId);

  if (!name) {
    throw Error("restaurant name not found");
  }

  const parsed: ParsedResponse = {
    id: response.Menu.MenuId,
    stations,
    restaurant: {
      id: response.LocationId,
      name,
    },
    dishes,
    start: menuPeriod.UtcMealPeriodStartTime,
    end: menuPeriod.UtcMealPeriodEndTime,
  };

  return parsed;
}
