import type { MenuPeriod, RestaurantName } from "@zotmeal/db";

// id mappings (period, restaurant)
// restaurant names

const restaurantIds = {
  brandywine: "3314",
  anteatery: "3056",
} as const;
export const getRestaurantId = (restaurant: RestaurantName): string | null => {
  if (!(restaurant in restaurantIds)) {
    return null;
  }

  return restaurantIds[restaurant];
};

const periodIds = {
  breakfast: "49",
  lunch: "106",
  dinner: "107",
  brunch: "2651",
  latenight: "108",
} as const;

export const getPeriodId = (period: MenuPeriod): string | null => {
  if (!(period in periodIds)) return null;

  return periodIds[period];
};
