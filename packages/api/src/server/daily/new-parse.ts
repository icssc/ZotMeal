// new-parse.ts
//
// This file contains all of the functions related to querying and processing
// data received from the UCI Dining GraphQL endpoint.

import { 
  getRestaurantId, 
  type InsertEvent, 
  type InsertDish,
  RestaurantName 
} from "@zotmeal/db";
import { 
  type LocationRecipesDaily, 
  type LocationInfo, 
  GetLocationSchema, 
  DiningHallInformation, 
  type MealPeriodWithHours,
  type WeekTimes,
  AEMEventListSchema,
  type EventList,
  GetLocationRecipesDailySchema,
  LocationRecipesWeekly,
  GetLocationRecipesWeeklySchema
} from "@zotmeal/validators";
import { 
  graphQLEndpoint,
  graphQLHeaders,
  getLocationQuery,
  AEMEventListQuery,
  GetLocationRecipesDailyQuery,
  GetLocationQueryVariables,
  AEMEventListQueryVariables,
  AEMEventListQueryRestaurant,
  GetLocationRecipesWeeklyVariables,
  GetLocationRecipesDailyVariables,
  GetLocationRecipesWeeklyQuery
} from "./queries";
import axios, { AxiosResponse } from "axios";
import { logger } from "@api/logger";

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
  location: GetLocationQueryVariables["locationUrlKey"],
  sortOrder: GetLocationQueryVariables["sortOrder"],
): Promise<DiningHallInformation> {
  const getLocationVariables = {
    locationUrlKey: location,
    sortOrder: sortOrder
  } as GetLocationQueryVariables;

  const response = await
    queryAdobeECommerce(getLocationQuery, getLocationVariables);
  
  const parsedData: LocationInfo = 
    GetLocationSchema.parse(response);

  const getLocation = parsedData.data.getLocation;
  const commerceMealPeriods = parsedData.data.Commerce_mealPeriods;
  const commerceAttributesList = parsedData.data.Commerce_attributesList;

  // Find the current schedule, if a special one is occurring
  let currentSchedule = 
    getLocation.aemAttributes.hoursOfOperation.schedule.find(schedule => {
      const today = new Date();
      const startDate = new Date(`${schedule.start_date}T00:00:00`);
      const endDate = new Date(`${schedule.end_date}T00:00:00`);

      return today >= startDate && today <= endDate;
  });

  // If no special schedule found, default to standard
  if (currentSchedule === undefined) {
    currentSchedule = 
      getLocation.aemAttributes.hoursOfOperation.schedule.find(schedule =>
       schedule.name == "Standard"
    );
  }

  let mealPeriods: MealPeriodWithHours[] =
    commerceMealPeriods.map(mealPeriod => {
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
    commerceAttributesList.items
    .find(item => 
      item.code == "allergens_intolerances"
    )!.options
    .map(item => ({
      code: Number.parseInt(item.value),
      label: item.label
    }));

  const menuPreferenceCodes =
    commerceAttributesList.items
    .find(item =>
      item.code == "menu_preferences"
    )!.options
    .map(item => ({
      code: Number.parseInt(item.value),
      label: item.label
    }));

  const stationsInfo =
    getLocation.commerceAttributes.children
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

/**  Fetches the Adobe ECommerce Menu specified for the date. */
export async function getAdobeEcommerceMenuDaily(
  date: Date,
  restaurantName: RestaurantName,
  periodId: string,
): Promise<InsertDish[]> {
  const getLocationRecipesVariables = {
    date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    locationUrlKey: restaurantUrlMap[restaurantName],
    mealPeriod: periodId,
    viewType: "DAILY",
  } as GetLocationRecipesDailyVariables;

  const res = await 
    queryAdobeECommerce(GetLocationRecipesDailyQuery, getLocationRecipesVariables);
  
  const parsedData: LocationRecipesDaily
    = GetLocationRecipesDailySchema.parse(res);

  const stationSkuMap = 
    parsedData.data.getLocationRecipes.locationRecipesMap.stationSkuMap;

  const products =
    parsedData.data.getLocationRecipes.products.items;

  return stationSkuMap.flatMap(station => 
    station.skus.map(sku => {
      // NOTE: This may be.. majorly majorly inefficient. I can't think of any 
      // way to structure the data such that we can reformat like this.
      // `products` may be quite long.
      const item = products.find(value => value.productView.sku == sku);

      if (item == undefined) {
        logger.error({msg: `Unable to find product with sku ${sku}.`})
      }

      const itemDescription = item?.productView.attributes
        .find(attr => attr.name == "marketing_description");

      const category = item?.productView.attributes
        .find(attr => attr.name == "master_recipe_type"); // Cereal, Fruit, etc.

      const recipeIngredients = item?.productView.attributes
        .find(attr => attr.name == "recipe_ingredients"); 

      return {
        id: sku,
        name: item?.productView.name ?? "UNIDENTIFIED",
        stationId: station.id.toString(),
        description: itemDescription?.value ?? "",
        category: category?.value ?? "",
        ingredients: recipeIngredients?.value ?? "",
      } as InsertDish;
    })
  );
}

type DateDish = {date: Date} & InsertDish;
// TODO: Reorg into separate file? Or just overhaul the 
//       server function organization entirely?
export async function getAdobeEcommerceMenuWeekly(
  date: Date,
  restaurantName: RestaurantName,
  periodId: string,
): Promise<DateDish[]> {
  const getLocationRecipesWeeklyVariables = {
    date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    locationUrlKey: restaurantUrlMap[restaurantName],
    mealPeriod: periodId,
    viewType: "WEEKLY",
  } as GetLocationRecipesWeeklyVariables;

  const res
    = queryAdobeECommerce(GetLocationRecipesWeeklyQuery, getLocationRecipesWeeklyVariables);
  
  const parsedData: LocationRecipesWeekly
    = GetLocationRecipesWeeklySchema.parse(res);
  const products 
    = parsedData.data.getLocationRecipes.products.items;
  const dateSkuMap 
    = parsedData.data.getLocationRecipes.locationRecipesMap.dateSkuMap;
 
  return dateSkuMap.flatMap(dateMap =>
    dateMap.stations.flatMap(stationMap =>
      stationMap.skus.simple.map(sku => {

      const item = products.find(value => value.productView.sku == sku);

      if (item == undefined) {
        logger.error({msg: `Unable to find product with sku ${sku}.`})
      }

      const itemDescription = item?.productView.attributes
        .find(attr => attr.name == "marketing_description");

      const category = item?.productView.attributes
        .find(attr => attr.name == "master_recipe_type"); // Cereal, Fruit, etc.


      const recipeIngredients = item?.productView.attributes
        .find(attr => attr.name == "recipe_ingredients"); 

        return {
          date: new Date(dateMap.date),
          id: sku,
          name: item?.productView.name ?? "UNIDENTIFIED",
          description: itemDescription?.value ?? "",
          category: category?.value ?? "",
          ingredients: recipeIngredients?.value ?? "",
          stationId: stationMap.id.toString(),
        } as DateDish;
      })
    )
  );
}

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


/** 
 * Fetches list of events for a given location 
 * Returns list of InsertEvent objects to be upserted into DB
*/
export async function getAEMEvents(
  location: AEMEventListQueryRestaurant
): Promise<InsertEvent[]> {
  const queryFilter = {
    filter: {
      campus: {
        _expressions: {
          _operator: "EQUALS",
          value: "campus"
        }
      },
      location: {
        name: {
          _expressions: {
            _operator: "EQUALS",
            value: location,
          }
        }
      } 
    } as AEMEventListQueryVariables,
  }

  let response = await
    queryAdobeECommerce(AEMEventListQuery, queryFilter);
  let data: EventList = 
    AEMEventListSchema.parse(response);
  let events = data.data.AEM_eventList.items
  const restaurantID = getRestaurantId(restaurantMap[location])

  return events.map(e => {
    let startDate = parseEventDate(e.startDate, e.startTime)
    let endDate = e.endTime
      ? parseEventDate(e.endDate ?? e.startDate, e.endTime)
      : null

    return {
      title: e.title,
      image: null,
      restaurantId: restaurantID,
      shortDescription: null,
      longDescription: e.description.markdown,
      start: startDate,
      end: endDate 
    }
  })
}

const restaurantMap = {
  "The Anteatery": "anteatery",
  "Brandywine": "brandywine"
} as const;

const restaurantUrlMap = {
  "anteatery": "the-anteatery",
  "brandywine": "brandywine",
} as const;

const parseEventDate = (dateStr: string, time: string) => {
  return new Date(`${dateStr}T${time}`)
}