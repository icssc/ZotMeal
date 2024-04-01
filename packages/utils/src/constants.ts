import type { MenuPeriod, Restaurant } from "@zotmeal/db/src/schema";

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

export const getRestaurantId = (restaurant: Restaurant["name"]): string | null => {
  if (!(restaurant in RESTAURANT_TO_ID)) {
    return null;
  }

  return RESTAURANT_TO_ID[restaurant];
};

export const getRestaurantNameById = (
  id: keyof typeof ID_TO_RESTAURANT,
): Restaurant["name"] | null => {
  if (!(id in ID_TO_RESTAURANT)) {
    return null;
  }

  return ID_TO_RESTAURANT[id] as Restaurant["name"];
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
  period: MenuPeriod["name"],
): keyof typeof ID_TO_PERIOD | null => {
  if (!(period in PERIOD_TO_ID)) return null;

  return PERIOD_TO_ID[period];
};

export const getPeriodById = (
  id: keyof typeof ID_TO_PERIOD,
): MenuPeriod["name"] | null => {
  if (!(id in ID_TO_PERIOD)) {
    return null;
  }

  return ID_TO_PERIOD[id] as MenuPeriod["name"];
};
