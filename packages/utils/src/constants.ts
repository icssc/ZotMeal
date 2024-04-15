import type { MenuPeriod, Restaurant } from "@zotmeal/db/src/schema";

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

export const RESTAURANT_TO_ID = {
  brandywine: "3314",
  anteatery: "3056",
} as const;
export const ID_TO_RESTAURANT = invertMapping(RESTAURANT_TO_ID);

export const getRestaurantId = (
  restaurant: Restaurant["name"]
): string | null => RESTAURANT_TO_ID[restaurant] ?? null;


export const getRestaurantNameById = (
  id: keyof typeof ID_TO_RESTAURANT,
): Restaurant["name"] | null => ID_TO_RESTAURANT[id] ?? null;

export const PERIOD_TO_ID: Record<MenuPeriod["name"], string> = {
  breakfast: "49",
  lunch: "106",
  dinner: "107",
  brunch: "2651",
  latenight: "108",
} as const;
export const ID_TO_PERIOD = invertMapping(PERIOD_TO_ID);

export const getPeriodId = (
  period: MenuPeriod["name"]
): keyof typeof ID_TO_PERIOD | null => PERIOD_TO_ID[period] ?? null;


export const getPeriodById = (
  id: keyof typeof ID_TO_PERIOD,
): MenuPeriod["name"] | null => ID_TO_PERIOD[id] ?? null;

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
export const getCurrentPeriodName = (): MenuPeriod["name"] => {
  const today = new Date();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  // breakfast: 7:15 AM - 11:00 AM on weekdays
  // and 9:00 AM - 11:00 AM on weekends
  if (hours < 11) {
    return "breakfast";
  }

  // breakfast, brunch, and dinner are on weekends
  if (isWeekend) {
    if (hours < 16 || (hours === 16 && minutes < 30)) { // if before 4:30 PM
      return "brunch";
    }
    return "dinner";
  }

  // mon-friday
  if (hours < 16 || (hours === 16 && minutes < 30)) { // if before 4:30 PM
    return "lunch";
  } else if (hours < 20) { // if before 8:00 PM
    return "dinner";
  } else {
    return today.getDay() === 5 ? "dinner" : "latenight"; // friday does not have latenight
  }
}

export const isCurrentlyClosed = (): boolean => {
  const today = new Date();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  if (isWeekend) {
    if (hours < 9 || (hours === 9 && minutes < 0)) { // if before 9:00 AM
      return true;
    }
  } else if (hours < 7 || (hours === 7 && minutes < 15)) { // if before 7:15 AM
    return true;
  }

  if (hours >= 23 || (hours === 22 && minutes > 0)) { // if after 11:00 PM
    return true;
  }

  if (today.getDay() === 5 && (hours >= 20 || (hours === 19 && minutes > 0))) { // if after 8:00 PM on friday
    return true;
  }

  return false;
}

export const PERIOD_NAMES = [
  "breakfast",
  "lunch",
  "dinner",
  "brunch",
  "latenight"
]
