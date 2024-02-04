import axios from "axios";

import type {
  // CampusDishMenuStation,
  CampusDishResponse,
  // ParsedResponse,
} from "@zotmeal/validators";
import { getPeriodId, getRestaurantId } from "@zotmeal/utils";

import { publicProcedure } from "../../trpc";
import { GetMenuSchema } from "./get";

export const parseMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ input }) => {
    const { date, restaurant, period } = input;

    // get the period by name from the db

    // use the db as the source of truth

    const periodId = getPeriodId(period);
    const restaurantId = getRestaurantId(restaurant);

    // const res = await axios.get(
    //   "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
    // );
    const res = await axios.get(
      `https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=${restaurantId}&periodId=${periodId}&date=${date}`,
    );

    const data = res.data as CampusDishResponse;

    // parseCampusDish(data);

    return data;
  });

// Should return our domain models
export function parseCampusDish(data: CampusDishResponse) {
  // we should get a menu object with a full nested hierarchy

  const uniqueStations = new Set<string>();
  data.Menu.MenuStations.forEach((menuStation) => {
    uniqueStations.add(
      JSON.stringify({
        station_id: menuStation.StationId,
        restaurant_id: data.LocationId,
        name: menuStation.Name,
      }),
    );
  });

  // const stations = Array.from(uniqueStations).map(
  //   (station) => JSON.parse(station) as CampusDishMenuStation,
  // );
  const parsed = {
    // restaurant: {
    //   restaurant_id: data.LocationId,
    //   restaurant_name:
    //     LocationNames[data.LocationId as keyof typeof LocationNames],
    // },
    // stations,
    // dishes: data.Menu.MenuProducts.map((menuProduct) => ({
    //   id: menuProduct.Product.ProductId,
    //   station_id: menuProduct.StationId,
    //   name: menuProduct.Product.MarketingName,
    //   description: menuProduct.Product.ShortDescription,
    //   dietary_restriction_info: {
    //     id: menuProduct.Product.ProductId,
    //     contains_eggs: menuProduct.Product.ContainsEggs,
    //     contains_fish: menuProduct.Product.ContainsFish,
    //     contains_milk: menuProduct.Product.ContainsMilk,
    //     contains_peanuts: menuProduct.Product.ContainsPeanuts,
    //     contains_shellfish: menuProduct.Product.ContainsShellfish,
    //     contains_soy: menuProduct.Product.ContainsSoy,
    //     contains_tree_nuts: menuProduct.Product.ContainsTreeNuts,
    //     contains_wheat: menuProduct.Product.ContainsWheat,
    //     contains_sesame: menuProduct.Product.ContainsSesame,
    //     is_gluten_free: menuProduct.Product.IsGlutenFree,
    //     is_halal: menuProduct.Product.IsHalal,
    //     is_kosher: menuProduct.Product.IsKosher,
    //     is_locally_grown: menuProduct.Product.IsLocallyGrown,
    //     is_organic: menuProduct.Product.IsOrganic,
    //     is_vegan: menuProduct.Product.IsVegan,
    //     is_vegetarian: menuProduct.Product.IsVegetarian,
    //   },
    // })),
  };
  return parsed;
}
