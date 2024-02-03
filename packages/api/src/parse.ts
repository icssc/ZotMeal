import { LocationNames } from "@acme/utils";
import type { CampusDishResponse, ParsedResponse } from "@acme/validators";

export function parse(data: CampusDishResponse) {
  const restaurant = {
    id: data.LocationId,
    name: LocationNames[data.LocationId],
  };

  const uniqueStations = new Set<string>();
  data.Menu.MenuStations.forEach(menuStation => {
    uniqueStations.add(JSON.stringify({
      id: menuStation.StationId,
      restaurantId: data.LocationId,
      name: menuStation.Name,
    }))
  });

  const stations = Array
    .from(uniqueStations)
    .map(station => JSON.parse(station) as ParsedResponse["stations"][0]);

  const dishes = data.Menu.MenuProducts.map(MenuProduct => ({
    id: MenuProduct.MenuProductId,
    stationId: MenuProduct.StationId,
    name: MenuProduct.Product.MarketingName,
    description: MenuProduct.Product.ShortDescription,
    dietaryRestrictionInfo: {
      id: MenuProduct.MenuProductId,
      containsEggs: MenuProduct.Product.ContainsEggs,
      containsFish: MenuProduct.Product.ContainsFish,
      containsMilk: MenuProduct.Product.ContainsMilk,
      containsPeanuts: MenuProduct.Product.ContainsPeanuts,
      containsShellfish: MenuProduct.Product.ContainsShellfish,
      containsSoy: MenuProduct.Product.ContainsSoy,
      containsTreeNuts: MenuProduct.Product.ContainsTreeNuts,
      containsWheat: MenuProduct.Product.ContainsWheat,
      containsSesame: MenuProduct.Product.ContainsSesame,
      isGlutenFree: MenuProduct.Product.IsGlutenFree,
      isHalal: MenuProduct.Product.IsHalal,
      isKosher: MenuProduct.Product.IsKosher,
      isLocallyGrown: MenuProduct.Product.IsLocallyGrown,
      isOrganic: MenuProduct.Product.IsOrganic,
      isVegan: MenuProduct.Product.IsVegan,
      isVegetarian: MenuProduct.Product.IsVegetarian,
    },
    nutritionInfo: {
      id: MenuProduct.MenuProductId,
      servingSize: MenuProduct.Product.ServingSize,
      servingUnit: MenuProduct.Product.ServingUnit,
      calories: MenuProduct.Product.Calories,
      caloriesFromFat: MenuProduct.Product.CaloriesFromFat,
      totalFat: MenuProduct.Product.TotalFat,
      transFat: MenuProduct.Product.TransFat,
      cholesterol: MenuProduct.Product.Cholesterol,
      sodium: MenuProduct.Product.Sodium,
      totalCarbohydrates: MenuProduct.Product.TotalCarbohydrates,
      dietaryFiber: MenuProduct.Product.DietaryFiber,
      sugars: MenuProduct.Product.Sugars,
      protein: MenuProduct.Product.Protein,
      vitaminA: MenuProduct.Product.VitaminA,
      vitaminC: MenuProduct.Product.VitaminC,
      calcium: MenuProduct.Product.Calcium,
      iron: MenuProduct.Product.Iron,
      saturatedFat: MenuProduct.Product.SaturatedFat,
    },
  }));

  const menuPeriods = data.Menu.MenuPeriods.map(MenuPeriod => ({
    id: MenuPeriod.PeriodId,
    name: MenuPeriod.Name,
    start: MenuPeriod.UtcMealPeriodStartTime,
    end: MenuPeriod.UtcMealPeriodEndTime,
  }));

  const parsed: ParsedResponse = {
    id: data.Menu.MenuId,
    restaurant,
    stations,
    dishes,
    menuPeriods,
  }

  return parsed;
}