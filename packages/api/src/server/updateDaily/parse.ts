import axios from "axios";
import { format } from "date-fns";

import type {
  DietRestriction,
  DishWithRelations,
  Drizzle,
  Menu,
  NutritionInfo,
  Restaurant,
  Station,
} from "@zotmeal/db";
import type { CampusDishResponse } from "@zotmeal/validators";
import { MenuSchema } from "@zotmeal/db";
import {
  getPeriodId,
  getPeriodNameById,
  getRestaurantId,
  getRestaurantNameById,
  PeriodName,
  RestaurantName,
} from "@zotmeal/utils";
import { CampusDishResponseSchema } from "@zotmeal/validators";

import { insertDishMenuStationJoint, upsertDish } from "../../dishes/services";
import { upsertMenu } from "../../menus/services";
import { upsertRestaurant } from "../../restaurants/services";
import { upsertStation } from "../../stations/services";

export async function getCampusDish(
  date: Date,
  period: PeriodName,
  restaurantName: RestaurantName,
): Promise<CampusDishResponse> {
  const res = await axios.get(
    `https://uci-campusdish-com.translate.goog/api/menu/GetMenus`,
    {
      params: {
        locationId: getRestaurantId(restaurantName),
        periodId: getPeriodId(period),
        date: format(date, "MM/dd/yyyy"),
      },
    },
  );
  return CampusDishResponseSchema.parse(res.data);
}

export async function parseCampusDish(
  db: Drizzle,
  response: CampusDishResponse,
): Promise<void> {
  const restaurant = {
    id: response.LocationId,
    name: getRestaurantNameById(response.LocationId),
  } satisfies Restaurant;

  await upsertRestaurant(db, restaurant);

  const selectedPeriod = response.Menu.MenuPeriods.find(
    (period) => period.PeriodId === response.SelectedPeriodId,
  );

  if (!selectedPeriod)
    throw new Error(
      `Period ${response.SelectedPeriodId} (${getPeriodNameById(response.SelectedPeriodId)}) not found in response`,
    );

  const date = format(selectedPeriod.UtcMealPeriodStartTime, "yyyy-MM-dd");

  // create a string that is unique for this menu
  const menuIdHash = response.LocationId + date + response.SelectedPeriodId;

  // Insert Menu
  const menu = MenuSchema.parse({
    id: menuIdHash,
    restaurantId: response.LocationId,
    period: getPeriodNameById(response.SelectedPeriodId),
    start: new Date(selectedPeriod.UtcMealPeriodStartTime),
    end: new Date(selectedPeriod.UtcMealPeriodEndTime),
    date,
    price: "13", // TODO: add menu price to response
  } satisfies Menu);

  await upsertMenu(db, menu);

  // Insert all stations
  const stations: Station[] = response.Menu.MenuStations.map(
    (menuStation) =>
      ({
        id: menuStation.StationId,
        restaurantId: restaurant.id,
        name: menuStation.Name,
      }) satisfies Station,
  );

  await Promise.allSettled(
    stations.map((station) => upsertStation(db, station)),
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
    dishes.map((dish) =>
      upsertDish(db, dish).then(() =>
        insertDishMenuStationJoint(db, {
          dishId: dish.id,
          menuId: menuIdHash,
          stationId: dish.stationId,
        }),
      ),
    ),
  );
}
