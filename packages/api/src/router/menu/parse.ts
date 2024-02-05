import axios from "axios";
import { ZodError } from "zod";

import type {
  CampusDishResponse,
  DietRestrictionSchema,
  DishSchema,
} from "@zotmeal/validators";
import {
  getPeriodId,
  getRestaurantById,
  getRestaurantId,
} from "@zotmeal/utils";
import { CampusDishResponseSchema } from "@zotmeal/validators";

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

export function parseCampusDish(response: CampusDishResponse) {
  const uniqueStations = new Set<string>();
  response.Menu.MenuStations.forEach((menuStation) => {
    uniqueStations.add(
      JSON.stringify({
        station_id: menuStation.StationId,
        restaurant_id: response.LocationId,
        name: menuStation.Name,
      }),
    );
  });

  const stations = Array.from(uniqueStations).map(
    (station) =>
      JSON.parse(station) as {
        station_id: string;
        restaurant_id: string;
        name: string;
      },
  );

  const dishes = response.Menu.MenuProducts.map((menuProduct) => {
    type DietRestriction = z.infer<typeof DietRestrictionSchema>;
    const dietRestriction = {
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
    } as DietRestriction;

    type Dish = z.infer<typeof DishSchema>;

    return {
      id: menuProduct.MenuProductId,
      stationId: menuProduct.StationId,
      name: menuProduct.Product.MarketingName,
      description: menuProduct.Product.ShortDescription,
      dietRestriction: dietRestriction,
    } as Dish;
  });
  const parsed = {
    restaurant: {
      restaurant_id: response.LocationId,
      restaurant_name: getRestaurantById(response.LocationId),
    },
    stations,
    dishes: dishes,
  };
  return parsed;
}
