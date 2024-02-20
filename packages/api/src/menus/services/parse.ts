import type { Prisma, PrismaClient } from "@zotmeal/db";
import type {
  CampusDishResponse,
  MenuPeriodParams,
  StationParams,
} from "@zotmeal/validators";
import { parseDate } from "@zotmeal/utils";

import type {
  DietRestrictionParams,
  DishParams,
  NutritionInfoParams,
} from "../../dishes/models";
import type { GetMenuParams, MenuResponse } from "../models/menu";
import { getRestaurantById } from "../../restaurants/services/restaurant";

export async function getMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetMenuParams,
): Promise<MenuResponse | null> {
  const { date: dateString, period, restaurant: restaurantName } = params;

  const restaurant = await getRestaurantById(db, restaurantName);
  if (restaurant === null) {
    console.error("restaurant not found: ", restaurantName);
    return null;
  }

  const date = parseDate(dateString);
  if (!date) {
    console.error("invalid date", dateString);
    return null;
  }

  const menu: MenuResponse | null = await db.menu.findFirst({
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

// export async function parseMenu(
//   db: PrismaClient | Prisma.TransactionClient,
//   params: GetMenuParams,
// ): Promise<MenuModel | null> {
//   const { date, restaurant, period } = params;

//   const periodId = getPeriodId(period);

//   if (!periodId) {
//     console.error("invalid period", period);
//     return null;
//   }

//   const restaurantId = getRestaurantId(restaurant);

//   // const res = await axios.get(
//   //   "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
//   // );

//   const res = await axios.get(
//     `https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=${restaurantId}&periodId=${periodId}&date=${date}`,
//   );

//   try {
//     const validated = CampusDishResponseSchema.parse(res.data);
//     return parseCampusDish(validated);
//   } catch (e) {
//     if (e instanceof ZodError) {
//       console.log(e.issues);
//     }
//     console.log(e);
//     throw e;
//   }
// }

// interface ParsedCampusDishResponse {
//   id: string;
//   stations: Station[];
// }
export function parseCampusDish(
  db: PrismaClient,
  response: CampusDishResponse,
): void {
  const restaurantId = response.LocationId;
  // Get Dish Info
  // Get Menu Info

  const periods: MenuPeriodParams[] = response.Menu.MenuPeriods.map(
    (menuPeriod) => {
      return {
        id: menuPeriod.PeriodId,
        name: menuPeriod.Name,
        start: menuPeriod.UtcMealPeriodStartTime,
        end: menuPeriod.UtcMealPeriodEndTime,
      };
    },
  );
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

  const dishesByStationId: Record<string, DishParams[]> = {};

  for (const dish of dishes) {
    if (!(dish.stationId in dishesByStationId)) {
      dishesByStationId[dish.stationId] = [];
    }

    dishesByStationId[dish.stationId]!.push(dish);
  }

  const stations: StationParams[] = response.Menu.MenuStations.map(
    (menuStation) => {
      return {
        id: menuStation.StationId,
        restaurantId: restaurantId,
        name: menuStation.Name,
      };
    },
  );


  // const stationsByPeriod: Record<string, unknown> = {};
  // response.Menu.MenuPeriods

  // for (const station of response.Menu.MenuStations) {

  // }

  // const numPeriods = response.Menu.MenuPeriods

  // const dishes: DishParams[] = [];
  // for (const menuProduct of response.Menu.MenuProducts) {
  //   const { MenuProductId, Product, StationId } = menuProduct;

  //   const dietRestriction: DietRestrictionParams = {
  //     containsEggs: Product.ContainsEggs,
  //     containsFish: Product.ContainsFish,
  //     containsMilk: Product.ContainsMilk,
  //     containsPeanuts: Product.ContainsPeanuts,
  //     containsShellfish: Product.ContainsShellfish,
  //     containsSoy: Product.ContainsSoy,
  //     containsTreeNuts: Product.ContainsTreeNuts,
  //     containsWheat: Product.ContainsWheat,
  //     containsSesame: Product.ContainsSesame,
  //     isGlutenFree: Product.IsGlutenFree,
  //     isHalal: Product.IsHalal,
  //     isKosher: Product.IsKosher,
  //     isLocallyGrown: Product.IsLocallyGrown,
  //     isOrganic: Product.IsOrganic,
  //     isVegan: Product.IsVegan,
  //     isVegetarian: Product.IsVegetarian,
  //   };

  //   const nutritionInfo: NutritionInfo = {
  //     servingSize: Product.ServingSize,
  //     servingUnit: Product.ServingUnit,
  //     calories: Product.Calories,
  //     caloriesFromFat: Product.CaloriesFromFat,
  //     totalFat: Product.TotalFat,
  //     transFat: Product.TransFat,
  //     cholesterol: Product.Cholesterol,
  //     sodium: Product.Sodium,
  //     totalCarbohydrates: Product.TotalCarbohydrates,
  //     dietaryFiber: Product.DietaryFiber,
  //     sugars: Product.Sugars,
  //     protein: Product.Protein,
  //     vitaminA: Product.VitaminA,
  //     vitaminC: Product.VitaminC,
  //     calcium: Product.Calcium,
  //     iron: Product.Iron,
  //     saturatedFat: Product.SaturatedFat,
  //   };

  //   const dish: DishParams = {
  //     id: MenuProductId,
  //     stationId: StationId,
  //     name: Product.MarketingName,
  //     description: Product.ShortDescription,
  //     dietRestriction,
  //     nutritionInfo,
  //   };
  //   dishes.push(dish);
  // }

  // const dishesByStationId: Record<string, DishParams[]> = {};
  // for (const dish of dishes) {
  //   if (!(dish.stationId in dishesByStationId)) {
  //     dishesByStationId.stationId = [];
  //   }
  //   dishesByStationId[dish.stationId];
  // }

  // const stations = [];
  // for (const menuStation of response.Menu.MenuStations) {
  //   const station: StationParams = {
  //     id: menuStation.StationId,
  //     restaurantId: response.LocationId,
  //     name: menuStation.Name,
  //     dishes: dishesByStationId[menuStation.StationId]!,
  //   };
  //   stations.push(station);
  // }

  // // periods
  // const restaurant = RestaurantSchema.parse({
  //   id: response.LocationId,
  //   name: getRestaurantNameById(response.LocationId),
  // });

  // response.Menu.MenuPeriods

  // const menu: MenuParams = {
  //   stations,
  //   restaurant,
  //   id: response.Menu.MenuId,
  // };

  // let stations: Station[];
  // try {
  //   stations = Array.from(uniqueStations).map((station) =>
  //     StationSchema.parse(JSON.parse(station)),
  //   );
  // } catch (e) {
  //   console.error(e);
  //   throw e;
  // }

  // const dishes = response.Menu.MenuProducts.map((menuProduct): DishParams => {
  //   const { Product, MenuProductId, StationId } = menuProduct;

  // const dietRestriction: DietRestrictionParams = {
  //   containsEggs: Product.ContainsEggs,
  //   containsFish: Product.ContainsFish,
  //   containsMilk: Product.ContainsMilk,
  //   containsPeanuts: Product.ContainsPeanuts,
  //   containsShellfish: Product.ContainsShellfish,
  //   containsSoy: Product.ContainsSoy,
  //   containsTreeNuts: Product.ContainsTreeNuts,
  //   containsWheat: Product.ContainsWheat,
  //   containsSesame: Product.ContainsSesame,
  //   isGlutenFree: Product.IsGlutenFree,
  //   isHalal: Product.IsHalal,
  //   isKosher: Product.IsKosher,
  //   isLocallyGrown: Product.IsLocallyGrown,
  //   isOrganic: Product.IsOrganic,
  //   isVegan: Product.IsVegan,
  //   isVegetarian: Product.IsVegetarian,
  // };

  // const nutritionInfo: NutritionInfo = {
  //   servingSize: Product.ServingSize,
  //   servingUnit: Product.ServingUnit,
  //   calories: Product.Calories,
  //   caloriesFromFat: Product.CaloriesFromFat,
  //   totalFat: Product.TotalFat,
  //   transFat: Product.TransFat,
  //   cholesterol: Product.Cholesterol,
  //   sodium: Product.Sodium,
  //   totalCarbohydrates: Product.TotalCarbohydrates,
  //   dietaryFiber: Product.DietaryFiber,
  //   sugars: Product.Sugars,
  //   protein: Product.Protein,
  //   vitaminA: Product.VitaminA,
  //   vitaminC: Product.VitaminC,
  //   calcium: Product.Calcium,
  //   iron: Product.Iron,
  //   saturatedFat: Product.SaturatedFat,
  // };

  //   return {
  //     id: MenuProductId,
  //     stationId: StationId,
  //     name: Product.MarketingName,
  //     description: Product.ShortDescription,
  //     dietRestriction,
  //     nutritionInfo,
  //   };
  // });

  // const name = getRestaurantNameById(response.LocationId);

  // const parsed = {
  //   id: response.Menu.MenuId,
  //   stations,
  //   restaurant: {
  //     id: response.LocationId,
  //     name,
  //   },
  //   dishes,
  //   start: menuPeriod.UtcMealPeriodStartTime,
  //   end: menuPeriod.UtcMealPeriodEndTime,
  // };

  // return parsed;
}
