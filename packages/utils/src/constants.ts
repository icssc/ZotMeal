import type { MenuPeriod, RestaurantName } from "@zotmeal/db";

// id mappings (period, restaurant)
// restaurant names

function invertMapping(
  mapping: Record<string, string>,
): Record<string, string> {
  const inverted: Record<string, string> = {};
  for (const key in mapping) {
    const value = mapping[key]!;
    inverted[value] = key;
  }

  return inverted;
}

export const RESTAURANT_TO_ID = {
  brandywine: "3314",
  anteatery: "3056",
} as const;
export const ID_TO_RESTAURANT = invertMapping(RESTAURANT_TO_ID);

// get the restaurantIds
export const [restaurantId, ...restaurantIds] = Object.keys(
  ID_TO_RESTAURANT,
);

export const getRestaurantId = (restaurant: RestaurantName): string | null => {
  if (!(restaurant in RESTAURANT_TO_ID)) {
    return null;
  }

  return RESTAURANT_TO_ID[restaurant];
};

export const getRestaurantById = (
  id: keyof typeof ID_TO_RESTAURANT,
): RestaurantName | null => {
  if (!(id in ID_TO_RESTAURANT)) {
    return null;
  }

  return ID_TO_RESTAURANT[id] as RestaurantName;
};

export const PERIOD_TO_ID = {
  breakfast: "49",
  lunch: "106",
  dinner: "107",
  brunch: "2651",
  latenight: "108",
};

export const ID_TO_PERIOD = invertMapping(PERIOD_TO_ID);

export const getPeriodId = (
  period: MenuPeriod,
): keyof typeof ID_TO_PERIOD | null => {
  if (!(period in PERIOD_TO_ID)) return null;

  return PERIOD_TO_ID[period];
};

export const getPeriodById = (
  id: keyof typeof ID_TO_PERIOD,
): MenuPeriod | null => {
  if (!(id in ID_TO_PERIOD)) {
    return null;
  }

  return ID_TO_PERIOD[id] as MenuPeriod;
};
