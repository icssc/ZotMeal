import axios from "axios";
import { ZodError } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type {
  DietRestriction,
  DishWithRelations,
  Menu,
  NutritionInfo,
  Period,
  Restaurant,
  Station,
} from "@zotmeal/db/src/schema";
import type { CampusDishResponse } from "@zotmeal/validators";
import { MenuSchema } from "@zotmeal/db/src/schema";
import {
  getPeriodId,
  getRestaurantId,
  getRestaurantNameById,
  ID_TO_PERIOD
} from "@zotmeal/utils";
import { CampusDishResponseSchema } from "@zotmeal/validators";
import { upsertDish, upsertDishMenuStationJoint } from "../../dishes";
import { upsertRestaurant } from "../../restaurants/services/restaurant";
import { upsertStation } from "../../stations";
import { upsertMenu } from "./menu";
import { format } from "date-fns";

interface GetMenuParams {
  date: string;
  period: string;
  restaurant: string;
}

export async function getCampusDish(
  params: GetMenuParams,
): Promise<CampusDishResponse | null> {

  const { date, restaurant, period } = params;

  //
  console.log("Begin parse of " + period);
  //

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

  const restaurant: Restaurant = {
    id: response.LocationId,
    name: restaurantName,
  };

  //
  console.log("Inserting restaurant");
  //

  await upsertRestaurant(db, restaurant);

  if (!response.SelectedPeriodId) {
    throw new Error("SelectedPeriodId is null");
  }
  if (!response.Menu.MenuPeriods[0]?.UtcMealPeriodEndTime) {
    throw new Error("MenuPeriods.UtcMealPeriodEndTime is null");
  }

  const date = format(response.Menu.MenuPeriods[0]?.UtcMealPeriodStartTime, "MM/dd/yyyy");

  const menuIdHash = response.LocationId + date + response.SelectedPeriodId;

  const menu = MenuSchema.parse({
    id: menuIdHash,
    restaurantId: response.LocationId,
    period: ID_TO_PERIOD[response.SelectedPeriodId],
    start: response.Menu.MenuPeriods[0].UtcMealPeriodStartTime,
    end: response.Menu.MenuPeriods[0].UtcMealPeriodEndTime,
    date: date,
    price: "13"  // Fix later
  })

  //
  console.log("Inserting menu");
  //

  await upsertMenu(db, menu);

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
      };

      const nutritionInfo: NutritionInfo = {
        dishId: MenuProductId,
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
      };

      return {
        id: MenuProductId,
        stationId: StationId,  // StationId for DishJointTable
        menuId: menuIdHash,    // MenuId for DishJointTable
        name: Product.MarketingName,
        description: Product.ShortDescription,
        category: Product.Categories?.[0]?.DisplayName ?? "Other", // category is other if not specified
        dietRestriction,
        nutritionInfo,
      };
    },
  );

  //
  console.log("Inserting dishes");
  //

  for (const dish of dishes) {
    await upsertDish(db, dish); // should nullcheck and throw for rollbacks
    await upsertDishMenuStationJoint(db, dish);
  }

  const stations: Station[] = response.Menu.MenuStations.map((menuStation) => {
    return {
      id: menuStation.StationId,
      restaurantId: restaurant.id,
      name: menuStation.Name,
    };
  });

  //
  console.log("Inserting stations");
  //

  for (const station of stations) {
    await upsertStation(db, station);
  }
}
