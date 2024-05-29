import { isFriday, isWeekend } from "date-fns";

export enum RestaurantEnum {
  anteatery = "3056",
  brandywine = "3314",
}

export enum PeriodEnum {
  breakfast = "49",
  brunch = "2651",
  lunch = "106",
  "light lunch" = "3819",
  dinner = "107",
  latenight = "108",
}

export const restaurantNames = Object.keys(RestaurantEnum) as [RestaurantName];
export const restaurantIds = Object.values(RestaurantEnum) as [RestaurantId];
export const periodNames = Object.keys(PeriodEnum) as [PeriodName];
export const periodIds = Object.values(PeriodEnum) as [PeriodId];

// light lunch -> Light Lunch

export const capitalizedPeriodNames = periodNames.map((name) =>
  name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
) as [Capitalize<PeriodName>];

// export const capitalizedPeriodNames = periodNames.map(
//   (name) => name.charAt(0).toUpperCase() + name.slice(1),
// ) as [Capitalize<PeriodName>];

type GetEnumKeys<Enum> = keyof Enum;
export type RestaurantName = GetEnumKeys<typeof RestaurantEnum>;
export type PeriodName = GetEnumKeys<typeof PeriodEnum>;

export type RestaurantId = `${RestaurantEnum}`;
export type PeriodId = `${PeriodEnum}`;

export const getRestaurantId = (name: RestaurantName) => RestaurantEnum[name];
export const getPeriodId = (name: PeriodName) => PeriodEnum[name];

export const getRestaurantNameById = (id: RestaurantId) =>
  restaurantNames[restaurantIds.indexOf(id)]!;

export const getPeriodNameById = (id: PeriodId) =>
  periodNames[periodIds.indexOf(id)]!;

/**
 * Get the periods available for a given day.
 *
 * ! Sorting is based on the enum order, so it's brittle for now until we have a better solution
 */
export const getDayPeriodsByDate = (day: Date): PeriodName[] => {
  const periodIds: PeriodId[] = [
    getPeriodId("breakfast"),
    getPeriodId("dinner"),
  ];

  if (isWeekend(day)) periodIds.push(getPeriodId("brunch"));
  else {
    periodIds.push(getPeriodId("lunch"));
    periodIds.push(getPeriodId("light lunch"));
    if (!isFriday(day)) periodIds.push(getPeriodId("latenight"));
  }

  return periodNames.filter((name) => periodIds.includes(getPeriodId(name)));
};

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
 *    Mon - Fri 11:00AM - 2:30PM
 * Light Lunch
 *    Mon - Fri  2:30PM - 4:30PM
 * Dinner
 *    Mon - Sun  4:30PM - 8:00PM
 * Latenight
 *    Mon - Thu 8:00PM - 11:00PM
 *
 * @returns the current period based on the current time
 */
export const getCurrentPeriodName = (): PeriodName | "closed" => {
  const today = new Date();
  const totalMinutes = today.getHours() * 60 + today.getMinutes();
  const weekend = isWeekend(today);

  const breakfastWeekdayStart = 7 * 60 + 15;
  const breakfastWeekendStart = 9 * 60;
  const breakfastEnd = 11 * 60;
  const brunchEnd = 16 * 60 + 30;
  const lunchEnd = 14 * 60 + 30;
  const lightLunchEnd = 16 * 60 + 30;
  const dinnerEnd = 20 * 60;
  const lateNightEnd = 23 * 60;

  if (
    !weekend &&
    totalMinutes >= breakfastWeekdayStart &&
    totalMinutes < breakfastEnd
  )
    return "breakfast";
  else if (
    weekend &&
    totalMinutes >= breakfastWeekendStart &&
    totalMinutes < breakfastEnd
  )
    return "breakfast";
  else if (weekend && totalMinutes >= breakfastEnd && totalMinutes < brunchEnd)
    return "brunch";
  else if (!weekend && totalMinutes >= breakfastEnd && totalMinutes < lunchEnd)
    return "lunch";
  else if (!weekend && totalMinutes >= lunchEnd && totalMinutes < lightLunchEnd)
    return "light lunch";
  else if (totalMinutes >= lightLunchEnd && totalMinutes < dinnerEnd)
    return "dinner";
  else if (
    !weekend &&
    !isFriday(today) &&
    totalMinutes >= dinnerEnd &&
    totalMinutes < lateNightEnd
  )
    return "latenight";

  return "closed";
};
