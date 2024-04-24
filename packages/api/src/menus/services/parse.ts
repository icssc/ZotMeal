import axios from "axios";
import { format } from "date-fns";
import { ZodError } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type {
  DietRestriction,
  DishWithRelations,
  Menu,
  NutritionInfo,
  Restaurant,
  Station,
} from "@zotmeal/db/src/schema";
import type { CampusDishResponse } from "@zotmeal/validators";
import { MenuSchema } from "@zotmeal/db/src/schema";
import {
  getPeriodById,
  getPeriodId,
  getRestaurantId,
  getRestaurantNameById,
} from "@zotmeal/utils";
import { CampusDishResponseSchema } from "@zotmeal/validators";

import { insertDishMenuStationJoint, upsertDish } from "../../dishes";
import { upsertRestaurant } from "../../restaurants/services/restaurant";
import { upsertStation } from "../../stations";
import { upsertMenu } from "./menu";

export interface GetMenuParams {
  date: string;
  period: string;
  restaurant: string;
}

export async function getCampusDish(
  params: GetMenuParams,
): Promise<CampusDishResponse | null> {
  const { date, restaurant, period } = params;

  // Verify Parameters

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

  // Request Format:
  // const res = await axios.get(
  //   "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
  // );

  const res = await axios.get(
    `https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=${restaurantId}&periodId=${periodId}&date=${date}`,
  );

  // Verify response schema
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
  // Verify params
  const restaurantName = getRestaurantNameById(response.LocationId);

  if (!restaurantName) {
    throw new Error("restaurant id not found");
  }

  const restaurant = {
    id: response.LocationId,
    name: restaurantName,
  } satisfies Restaurant;

  await upsertRestaurant(db, restaurant);

  // Filter the period in the response based on selected period
  const selectedPeriod = response.Menu.MenuPeriods.find(
    (period) => period.PeriodId === response.SelectedPeriodId,
  );

  if (!selectedPeriod) {
    throw new Error(
      `Period ${response.SelectedPeriodId} (${getPeriodById(response.SelectedPeriodId)}) not found in response`,
    );
  }

  const date = format(selectedPeriod.UtcMealPeriodStartTime, "MM/dd/yyyy");

  const menuIdHash = response.LocationId + date + response.SelectedPeriodId;

  // Insert Menu
  const menu = MenuSchema.parse({
    id: menuIdHash,
    restaurantId: response.LocationId,
    period: getPeriodById(response.SelectedPeriodId) as Menu["period"],
    start: selectedPeriod.UtcMealPeriodStartTime,
    end: selectedPeriod.UtcMealPeriodEndTime,
    date,
    price: "13", // TODO: add menu price to response
  } satisfies Menu);

  await upsertMenu(db, menu);

  // Insert all stations
  const stations: Station[] = response.Menu.MenuStations.map((menuStation) => {
    return {
      id: menuStation.StationId,
      restaurantId: restaurant.id,
      name: menuStation.Name,
    } satisfies Station;
  });

  await Promise.allSettled(
    stations.map(async (station) => {
      await upsertStation(db, station);
    }),
  );

  // Insert all dishes and dish relations
  const dishes: DishWithRelations[] = response.Menu.MenuProducts.map(
    (menuProduct) => {
      const { ProductId, StationId, Product } = menuProduct;
      const dietRestriction = {
        dishId: ProductId,
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

      const nutritionInfo = {
        dishId: ProductId,
        servingSize: Product.ServingSize,
        servingUnit: Product.ServingUnit,
        calories: Product.Calories,
        caloriesFromFat: Product.CaloriesFromFat,
        totalFatG: Product.TotalFat,
        transFatG: Product.TransFat,
        cholesterolMg: Product.Cholesterol,
        sodiumMg: Product.Sodium,
        totalCarbsG: Product.TotalCarbohydrates,
        dietaryFiberG: Product.DietaryFiber,
        sugarsMg: Product.Sugars,
        proteinG: Product.Protein,
        vitaminAIU: Product.VitaminA,
        vitaminCIU: Product.VitaminC,
        calciumMg: Product.Calcium,
        ironMg: Product.Iron,
        saturatedFatG: Product.SaturatedFat,
      } satisfies NutritionInfo;

      return {
        id: ProductId, //
        stationId: StationId, // StationId for DishJointTable
        menuId: menuIdHash, // MenuId for DishJointTable
        name: Product.MarketingName,
        description: Product.ShortDescription,
        category: Product.Categories?.[0]?.DisplayName ?? "Other", // category is other if not specified
        dietRestriction,
        nutritionInfo,
      } satisfies DishWithRelations;
    },
  );

  await Promise.allSettled(
    dishes.map(async (dish) => {
      await upsertDish(db, dish);
      await insertDishMenuStationJoint(db, dish);
    }),
  );
}
