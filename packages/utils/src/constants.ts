import { isFriday, isWeekend } from "date-fns";

import type { Period, Restaurant } from "@zotmeal/db";

// id mappings (period, restaurant)

function invertMapping<K extends PropertyKey, V extends PropertyKey>(
  mapping: Record<K, V>,
): Record<V, K> {
  const inverted = {} as Record<V, K>;
  for (const key in mapping) {
    const value = mapping[key];
    inverted[value] = key;
  }

  return inverted;
}

export const RESTAURANT_TO_ID = {
  brandywine: "3314",
  anteatery: "3056",
} as const satisfies Record<Restaurant["name"], string>;

export const PERIOD_TO_ID = {
  breakfast: "49",
  brunch: "2651",
  dinner: "107",
  latenight: "108",
  lunch: "106",
} as const satisfies Record<Period, string>;

export const ID_TO_RESTAURANT = invertMapping(RESTAURANT_TO_ID);
export const ID_TO_PERIOD = invertMapping(PERIOD_TO_ID);

export type RestaurantId = keyof typeof ID_TO_RESTAURANT;
export type PeriodId = keyof typeof ID_TO_PERIOD;

export const getRestaurantId = (name: Restaurant["name"]) =>
  RESTAURANT_TO_ID[name];

export const getRestaurantNameById = (id: RestaurantId) => ID_TO_RESTAURANT[id];

export const getPeriodId = (name: Period) => PERIOD_TO_ID[name];
export const getPeriodById = (id: PeriodId) => ID_TO_PERIOD[id];

/**
 * Based on UCI Campusdish website:
 *
 * @see https://uci.campusdish.com/en/locationsandmenus/theanteatery/
 *
 * @see https://uci.campusdish.com/en/locationsandmenus/brandywine/
 *
 * @example
 * Breakfast
 *    Mon - Fri 7:15AM - 11:00AM
 *    Sat - Sun 9:00AM - 11:00AM
 * Brunch
 *    Sat - Sun 11:00AM - 4:30PM
 * Lunch
 *    Mon - Fri 11:00AM - 4:30PM
 * Dinner
 *    Mon - Sun 4:30PM - 8:00PM
 * Latenight
 *    Mon - Thu 8:00PM - 11:00PM
 *
 * @returns the current period based on the current time
 */
export const getCurrentPeriodName = (): Period | "closed" => {
  const today = new Date();
  const totalMinutes = today.getHours() * 60 + today.getMinutes();
  const weekend = isWeekend(today);

  const breakfastWeekdayStart = 7 * 60 + 15;
  const breakfastWeekendStart = 9 * 60;
  const breakfastEnd = 11 * 60;
  const brunchEnd = 16 * 60 + 30;
  const dinnerEnd = 20 * 60;
  const lateNightEnd = 23 * 60;

  if (
    !weekend &&
    totalMinutes >= breakfastWeekdayStart &&
    totalMinutes < breakfastEnd
  ) {
    return "breakfast";
  } else if (
    weekend &&
    totalMinutes >= breakfastWeekendStart &&
    totalMinutes < breakfastEnd
  ) {
    return "breakfast";
  } else if (
    weekend &&
    totalMinutes >= breakfastEnd &&
    totalMinutes < brunchEnd
  ) {
    return "brunch";
  } else if (
    !weekend &&
    totalMinutes >= breakfastEnd &&
    totalMinutes < brunchEnd
  ) {
    return "lunch";
  } else if (totalMinutes >= brunchEnd && totalMinutes < dinnerEnd) {
    return "dinner";
  } else if (
    !weekend &&
    !isFriday(today) &&
    totalMinutes >= dinnerEnd &&
    totalMinutes < lateNightEnd
  ) {
    return "latenight";
  }
  return "closed";
};
