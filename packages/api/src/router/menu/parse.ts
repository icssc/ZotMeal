import type { z } from "zod";
import axios from "axios";
import { ZodError } from "zod";

import type {
  CampusDishResponse,
  DietRestrictionSchema,
  ParsedDish,
  ParsedResponse,
  ParsedStation,
} from "@zotmeal/validators";
import {
  getPeriodId,
  getRestaurantById,
  getRestaurantId,
} from "@zotmeal/utils";
import {
  CampusDishResponseSchema,
  NutritionInfoSchema,
} from "@zotmeal/validators";

import { publicProcedure } from "../../trpc";
import { GetMenuSchema } from "./get";

export const parseMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx, input }) => {
    const { db } = ctx;
    const _ = db;
    const { date, restaurant, period } = input;

    const periodId = getPeriodId(period);
    const restaurantId = getRestaurantId(restaurant);

    // const res = await axios.get(
    //   "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
    // );

    const res = await axios.get(
      `https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=${restaurantId}&periodId=${periodId}&date=${date}`,
    );

    try {
      const validated = CampusDishResponseSchema.parse(res);
      const menu = parseCampusDish(validated);
      return menu;
    } catch (e) {
      if (e instanceof ZodError) {
        console.log(e.issues);
      }
      console.log(e);
      throw e;
    }
  });

export function parseCampusDish(response: CampusDishResponse): ParsedResponse {
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
    const dietRestriction: DietRestriction = {
      containsEggs: menuProduct.Product.ContainsEggs,
      containsFish: menuProduct.Product.ContainsFish,
      containsMilk: menuProduct.Product.ContainsMilk,
      containsPeanuts: menuProduct.Product.ContainsPeanuts,
      containsShellfish: menuProduct.Product.ContainsShellfish,
      containsSoy: menuProduct.Product.ContainsSoy,
      containsTreeNuts: menuProduct.Product.ContainsTreeNuts,
      containsWheat: menuProduct.Product.ContainsWheat,
      containsSesame: menuProduct.Product.ContainsSesame,
      isGlutenFree: menuProduct.Product.IsGlutenFree,
      isHalal: menuProduct.Product.IsHalal,
      isKosher: menuProduct.Product.IsKosher,
      isLocallyGrown: menuProduct.Product.IsLocallyGrown,
      isOrganic: menuProduct.Product.IsOrganic,
      isVegan: menuProduct.Product.IsVegan,
      isVegetarian: menuProduct.Product.IsVegetarian,
    };

    type NutritionInfo = z.infer<typeof NutritionInfoSchema>;
    const nutritionInfo: NutritionInfo = {
      servingSize: menuProduct.Product.ServingSize,
      servingUnit: menuProduct.Product.ServingUnit,
      calories: menuProduct.Product.Calories,
      caloriesFromFat: menuProduct.Product.CaloriesFromFat,
      totalFat: menuProduct.Product.TotalFat,
      transFat: menuProduct.Product.TransFat,
      cholesterol: menuProduct.Product.Cholesterol,
      sodium: menuProduct.Product.Sodium,
      totalCarbohydrates: menuProduct.Product.TotalCarbohydrates,
      dietaryFiber: menuProduct.Product.DietaryFiber,
      sugars: menuProduct.Product.Sugars,
      protein: menuProduct.Product.Protein,
      vitaminA: menuProduct.Product.VitaminA,
      vitaminC: menuProduct.Product.VitaminC,
      calcium: menuProduct.Product.Calcium,
      iron: menuProduct.Product.Iron,
      saturatedFat: menuProduct.Product.SaturatedFat,
    };

    return {
      id: menuProduct.MenuProductId,
      stationId: menuProduct.StationId,
      name: menuProduct.Product.MarketingName,
      description: menuProduct.Product.ShortDescription,
      dietRestriction,
      nutritionInfo,
    };
  });

  if (!getRestaurantById(response.LocationId)) {
    throw Error("location id not found");
  }

  const parsed: ParsedResponse = {
    stations,
    restaurant: {
      id: response.LocationId,
      name: getRestaurantById(response.LocationId) as string,
    },
    dishes: dishes,
  };
  return parsed;
}
