import { isFriday, isWeekend } from "date-fns";

import type { Period, Restaurant } from "@zotmeal/db/src/schema";

// id mappings (period, restaurant)
// restaurant names

function invertMapping<K extends string, V extends string>(
  mapping: Record<K, V>,
): Record<V, K> {
  const inverted = {} as Record<V, K>;
  for (const key in mapping) {
    const value = mapping[key];
    inverted[value] = key;
  }

  return inverted;
}

export const RESTAURANT_TO_ID: Record<Restaurant["name"], string> = {
  brandywine: "3314",
  anteatery: "3056",
} as const;
export const ID_TO_RESTAURANT = invertMapping(RESTAURANT_TO_ID);

export const getRestaurantId = (
  restaurant: Restaurant["name"],
): string | null => RESTAURANT_TO_ID[restaurant] ?? null;

export const getRestaurantNameById = (
  id: keyof typeof ID_TO_RESTAURANT,
): Restaurant["name"] | null => ID_TO_RESTAURANT[id] ?? null;

export const PERIOD_TO_ID: Record<Period["name"], string> = {
  breakfast: "49",
  lunch: "106",
  dinner: "107",
  brunch: "2651",
  latenight: "108",
} as const;
export const ID_TO_PERIOD = invertMapping(PERIOD_TO_ID);

export const getPeriodId = (
  period: Period["name"],
): keyof typeof ID_TO_PERIOD | null => PERIOD_TO_ID[period] ?? null;

export const getPeriodById = (
  id: keyof typeof ID_TO_PERIOD,
): Period["name"] | null => ID_TO_PERIOD[id] ?? null;

/**
 * Based on UCI Campusdish website:
 *
 * https://uci.campusdish.com/en/locationsandmenus/theanteatery/
 *
 * https://uci.campusdish.com/en/locationsandmenus/brandywine/
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
export const getCurrentPeriodName = (): string => {
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
