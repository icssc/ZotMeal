import type { MenuPeriod, RestaurantName } from "@zotmeal/db";

// id mappings (period, restaurant)
// restaurant names

const restaurantToId = {
  brandywine: "3314",
  anteatery: "3056",
} as const;
export const getRestaurantId = (restaurant: RestaurantName): string | null => {
  if (!(restaurant in restaurantToId)) {
    return null;
  }

  return restaurantToId[restaurant];
};

const periodToId = {
  breakfast: "49",
  lunch: "106",
  dinner: "107",
  brunch: "2651",
  latenight: "108",
} as const;

export const getPeriodId = (period: MenuPeriod): string | null => {
  if (!(period in periodToId)) return null;

  return periodToId[period];
};
