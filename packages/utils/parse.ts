import { LocationNames } from "./constants";
import { CampusDishResponse } from "../validators/src";

export function parse(data: CampusDishResponse) {
  const uniqueStations = new Set<string>();
  data.Menu.MenuStations.forEach(menuStation => {
    uniqueStations.add(JSON.stringify({
      station_id: menuStation.StationId,
      restaurant_id: data.LocationId,
      name: menuStation.Name,
    }))
  });
  const stations = Array.from(uniqueStations).map(station => JSON.parse(station));
  const parsed = {
    restaurant: {
      restaurant_id: data.LocationId,
      restaurant_name: LocationNames[data.LocationId as keyof typeof LocationNames],
    },
    stations,
    dishes: data.Menu.MenuProducts.map(menuProduct => ({
      id: menuProduct.Product.ProductId,
      station_id: menuProduct.StationId,
      name: menuProduct.Product.MarketingName,
      description: menuProduct.Product.ShortDescription,
      dietary_restriction_info: {
        id: menuProduct.Product.ProductId,
        contains_eggs: menuProduct.Product.ContainsEggs,
        contains_fish: menuProduct.Product.ContainsFish,
        contains_milk: menuProduct.Product.ContainsMilk,
        contains_peanuts: menuProduct.Product.ContainsPeanuts,
        contains_shellfish: menuProduct.Product.ContainsShellfish,
        contains_soy: menuProduct.Product.ContainsSoy,
        contains_tree_nuts: menuProduct.Product.ContainsTreeNuts,
        contains_wheat: menuProduct.Product.ContainsWheat,
        contains_sesame: menuProduct.Product.ContainsSesame,
        is_gluten_free: menuProduct.Product.IsGlutenFree,
        is_halal: menuProduct.Product.IsHalal,
        is_kosher: menuProduct.Product.IsKosher,
        is_locally_grown: menuProduct.Product.IsLocallyGrown,
        is_organic: menuProduct.Product.IsOrganic,
        is_vegan: menuProduct.Product.IsVegan,
        is_vegetarian: menuProduct.Product.IsVegetarian,
      }
    })),
  }
  return parsed;
}