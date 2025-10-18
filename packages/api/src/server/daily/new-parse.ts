import { RestaurantName } from "@zotmeal/db";
import { 
  type LocationRecipes, 
  type LocationInfo, 
  GetLocationSchema, 
  DiningHallInformation, 
  type MealPeriodWithHours,
  type WeekTimes
} from "@zotmeal/validators";
import { 
  graphQLEndpoint,
  graphQLHeaders,
  getLocationQuery, 
} from "./queries";
import axios, { AxiosResponse } from "axios";
import { logger } from "@api/logger";
import { number } from "zod";

export async function queryAdobeECommerce(
  query: string, 
  variables: object
): Promise<void | AxiosResponse> {
  return axios({
    method: "post",
    url: graphQLEndpoint,
    headers: graphQLHeaders,
    data: {
      query: query,
      variables: variables
    }
  }).catch(error => {
    logger.error(`Error with query ${query.split(' ')[1]?.replace('(', '')}: ${error}`);
  })
}

/** Fetches the information about a given dining hall. */
export async function getLocationInformation(
  location: "the-anteatery" | "brandywine",
  sortOrder: "ASC" | "DESC"
): Promise<DiningHallInformation> {
  const getLocationVariables = {
    locationUrlKey: location,
    sortOrder: sortOrder
  }

  let response = 
    queryAdobeECommerce(getLocationQuery, getLocationVariables);
  
  let data: LocationInfo = 
    GetLocationSchema.parse(response);

  // Find the current schedule, if a special one is occurring
  let currentSchedule = 
    data.getLocation.aemAttributes.hoursOfOperation.schedule.find(schedule => {
      const today = new Date();
      const startDate = new Date(`${schedule.start_date}T00:00:00`);
      const endDate = new Date(`${schedule.end_date}T00:00:00`);

      return today >= startDate && today <= endDate;
  });

  // If no special schedule found, default to standard
  if (currentSchedule === undefined) {
    currentSchedule = 
      data.getLocation.aemAttributes.hoursOfOperation.schedule.find(schedule =>
       schedule.name == "Standard"
    );
  }

  let mealPeriods: MealPeriodWithHours[] =
    data.Commerce_mealPeriods.map(mealPeriod => {
      let currentMealPeriod = currentSchedule!.meal_periods.find(period => 
        period.meal_period == mealPeriod.name
      );

      let [openHours, closeHours] = 
        parseOpeningHours(currentMealPeriod!.opening_hours);

      return {
        openHours,
        closeHours,
        ...mealPeriod
      }
  });

  const allergenIntoleranceCodes =
    data.Commerce_attributesList.items
    .find(item => 
      item.code == "allergens_intolerances"
    )!.options
    .map(item => ({
      code: Number.parseInt(item.value),
      label: item.label
    }));

  const menuPreferenceCodes =
    data.Commerce_attributesList.items
    .find(item =>
      item.code == "menu_preferences"
    )!.options
    .map(item => ({
      code: Number.parseInt(item.value),
      label: item.label
    }));

  const stationsInfo =
    data.getLocation.commerceAttributes.children
    .map(station => ({
      uid: station.uid,
      name: station.name
    }));

  return {
    mealPeriods,
    allergenIntoleranceCodes,
    menuPreferenceCodes,
    stationsInfo
  };
}

/**  Fetches the Adobe ECommerce Menu specified. */
// export async function getAdobeEcommerceMenu(
//   date: Date,
//   restaurantName: RestaurantName,
//   periodId: string,
// ): Promise<LocationRecipes> {
//   ;
// }

/**
 * Takes in data in the form "Mo-Fr 07:15-11:00; Sa-Su 09:00-11:00"
 */
function parseOpeningHours(hoursString : string): [WeekTimes, WeekTimes] {
  const DAY_MAP: { [key: string]: number } = {
    'Mo': 0, 'Tu': 1, 'We': 2, 'Th': 3, 'Fr': 4, 'Sa': 5, 'Su': 6
  };

  const openingTime: string[] = new Array(7).fill("");
  const closingTime: string[] = new Array(7).fill("");

  const timeBlocks = hoursString
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const block of timeBlocks) {
    // Example: block = "Mo-Fr 07:15-11:00"
    const parts = block.split(/\s+/); // Split by one or more spaces
    
    if (parts.length < 2) {
      console.warn(
        `[parseOpeningHours]: Skipping invalid time block format: ${block}`
      );
      continue;
    }

    const dayRangeStr = parts[0]!; // "Mo-Fr"
    const timeRangeStr = parts[1]!; // "07:15-11:00"
    const [openTime, closeTime] = timeRangeStr.split('-'); // "07:15", "11:00"

    if (!openTime || !closeTime) {
      console.warn(
        `[parseOpeningHours]: Skipping block with incomplete time range: ${block}`
      );
      continue;
    }

    let dayIndices: number[] = [];

    // Case: Day Range (e.g., "Mo-Fr")
    if (dayRangeStr.includes('-')) {
        const dayParts = dayRangeStr.split('-');

        if (dayParts.length < 2) {
          console.warn(
            `[parseOpeningHours]: Skipping block with malformed day range: ${dayRangeStr}}`
          );
          continue;
        }

        const startDay = dayParts[0]!;
        const endDay = dayParts[1]!;
        
        const startIndex = DAY_MAP[startDay];
        const endIndex = DAY_MAP[endDay];

        if (startIndex === undefined || endIndex === undefined) {
          console.warn(`Skipping block with unknown day range: ${dayRangeStr}`);
          continue;
        }
        
        // Generate indices for the range (handles Mo-Su wrap around implicitly 
        // if structured this way, but for standard day names it's a simple 
        // loop).
        for (let i = startIndex; i <= endIndex; i++) {
            dayIndices.push(i);
        }

    // Case: Single Day (e.g., "Mo")
    } else {
        const singleIndex = DAY_MAP[dayRangeStr];
        if (singleIndex !== undefined) {
            dayIndices.push(singleIndex);
        } else {
            console.warn(`Skipping block with unknown single day: ${dayRangeStr}`);
            continue;
        }
    }

    // Apply the times to the array indices
    for (const index of dayIndices) {
        openingTime[index] = openTime;
        closingTime[index] = closeTime;
    }
  }

    // Return the result, casting to the required fixed-length tuple type
    return [
        openingTime as WeekTimes,
        closingTime as WeekTimes
    ];
}