// new-parse.ts
//
// This file contains all of the functions related to querying and processing
// data received from the UCI Dining GraphQL endpoint.

import { 
  getRestaurantId, 
  type InsertEvent, 
  type InsertDish,
  RestaurantName, 
  InsertDishWithRelations
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

/**
 * Queries the Adobe ECommerce endpoint for restaurant information, dishes, etc.
 * with the appropriate headers and POST method.
 * @param query the graphQL query string
 * @param variables the variables for the GraphQL query
 * @returns an AxiosResponse from the query
 */
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

/**
 * Gets the information associated with a restaurant location, such as 
 * hours of operation, allergen intolerance codes, etc.
 * @param location the restaurant to get info for ("brandywine" | "anteatery")
 * @param sortOrder the order in which to sort the info ("ASC" | "DESC")
 * @returns @see{@link DiningHallInformation}
 */
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

  let allergenIntoleranceCodes: DiningHallInformation["allergenIntoleranceCodes"] = {};
  commerceAttributesList.items
    .find(item => 
      item.code == "allergens_intolerances"
    )!.options
    .forEach(item => {
      allergenIntoleranceCodes[item.label] = Number.parseInt(item.value);
    });

  let menuPreferenceCodes: DiningHallInformation["menuPreferenceCodes"] = {};
  commerceAttributesList.items
    .find(item =>
      item.code == "menu_preferences"
    )!.options
    .forEach(item => {
      menuPreferenceCodes[item.label] = Number.parseInt(item.value);
    });

  let stationsInfo: {[uid: string]: string} = {};
    getLocation.commerceAttributes.children
    .forEach(station => {
      stationsInfo[station.uid] = station.name;
    });

  return {
    mealPeriods,
    allergenIntoleranceCodes,
    menuPreferenceCodes,
    stationsInfo
  };
}

type InsertDishWithModifiedRelations = InsertDish & {
  nutritionInfo: InsertDishWithRelations["nutritionInfo"],
  allergenIntoleranceCodes: Set<number>,
}

/**
 * Fetches the Adobe ECommerce Menu specified for the date. 
 * @param date the date for which to get the menu
 * @param restaurantName the restaurant for which to get the menu
 * @param periodId the id of the period to query for
 * @returns a list of dishes + their nutrition info
 */
export async function getAdobeEcommerceMenuDaily(
  date: Date,
  restaurantName: RestaurantName,
  periodId: string,
): Promise<InsertDishWithModifiedRelations[]> {
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
  const parsedProducts = 
    parseProducts(parsedData.data.getLocationRecipes.products.items);
  const stationSkuMap = 
    parsedData.data.getLocationRecipes.locationRecipesMap.stationSkuMap;

  // Map all of the items from each station into a list of dishes
  return stationSkuMap.flatMap(station => 
    station.skus.map(sku => {
      let item = parsedProducts[sku];

      return {
        id: sku,
        name: item?.name ?? "UNIDENTIFIED",
        stationId: station.id.toString(),
        description: item?.description ?? "",
        category: item?.category ?? "",
        ingredients: item?.ingredients ?? "",
        nutritionInfo: item?.nutritionInfo,
      } as InsertDishWithModifiedRelations;
    })
  );
}

type DateDish = {date: Date} & InsertDish;
// TODO: Reorg into separate file? Or just overhaul the 
//       server function organization entirely?
/**
 * Fetches the Adobe ECommerce Menu specified for a week, starting at the date. 
 * @param date the date for which to start getting the menus
 * @param restaurantName the restaurant for which to get the dishes
 * @param periodId the meal period to get the menus for
 * @returns returns a list of objects for each date (@see {@link DateDish})
 */
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
  const parsedProducts = 
    parseProducts(parsedData.data.getLocationRecipes.products.items);
  const dateSkuMap 
    = parsedData.data.getLocationRecipes.locationRecipesMap.dateSkuMap;

  return dateSkuMap.flatMap(dateMap =>
    dateMap.stations.flatMap(stationMap =>
      stationMap.skus.simple.map(sku => {
        let item = parsedProducts[sku];

        return {
          date: new Date(dateMap.date),
          id: sku,
          name: item?.name ?? "UNIDENTIFIED",
          description: item?.description ?? "",
          category: item?.category ??  "",
          ingredients: item?.ingredients ?? "",
          stationId: stationMap.id.toString(),
        } as DateDish;
      })
    )
  );
}

type WeeklyProducts = 
  LocationRecipesWeekly["data"]["getLocationRecipes"]["products"]["items"];

type ProductAttributes = {
  name: string,
  description: string,
  category: string,
  ingredients: string,
  allergenIntolerances: Set<number>,
  nutritionInfo: InsertDishWithRelations["nutritionInfo"],
};

type ProductDictionary = {[sku: string] : ProductAttributes};

/**
 * Parses the product attributes found in {@link WeeklyProducts} into a 
 * more-conveniently accessible {@link ProductDictionary}
 * @param products An array of weekly products
 * @returns a dictionary associating the SKU of the product to its attributes
 */
function parseProducts(products: WeeklyProducts): ProductDictionary {
  let parsedProducts: ProductDictionary = {};

  products.forEach(product => {
    const attributesMap =  new Map(
      product.productView.attributes.map(attr => [attr.name, attr.value])
    );

    let unparsedIntolerances = attributesMap.get("allergens_intolerances");
    let allergenIntolerances: Set<number> = new Set<number>();

    // Allergen intolerances can either be one singular value or an array.
    if (Array.isArray(unparsedIntolerances)) {
      unparsedIntolerances.forEach(
        code => allergenIntolerances.add(Number.parseInt(code))
      );
    } else {
      allergenIntolerances.add(Number.parseInt(
        (unparsedIntolerances as string) ?? "0"
      ));
    }

    const nutritionInfo = {
      dishId: product.productView.sku,
      calories: (attributesMap.get("calories") as string) ?? "",
      totalFatG: (attributesMap.get("total_fat") as string) ?? "",
      transFatG: (attributesMap.get("trans_fat") as string) ?? "",
      sugarsG: (attributesMap.get("sugar") as string) ?? "",
      cholesterolMg: (attributesMap.get("cholesterol") as string) ?? "",
      totalCarbsG: (attributesMap.get("total_carbohydrates") as string) ?? "",
      dietaryFiberG: (attributesMap.get("dietary_fiber") as string) ?? "",
      proteinG: (attributesMap.get("protein") as string) ?? "",
    } as InsertDishWithRelations["nutritionInfo"];

    parsedProducts[product.productView.sku] = { 
      name: product.productView.name,
      description: (attributesMap.get("marketing_description") as string) ?? "",
      category: (attributesMap.get("master_recipe_type") as string) ?? "",
      ingredients: (attributesMap.get("recipe_ingredients") as string) ?? "",
      allergenIntolerances,
      nutritionInfo
    };
  });

  return parsedProducts;
}

/**
 * Takes in data in the form "Mo-Fr 07:15-11:00; Sa-Su 09:00-11:00"
 */
function parseOpeningHours(hoursString : string): [WeekTimes, WeekTimes] {
  const DAY_MAP: { [key: string]: number } = {
    'Su': 0, 'Mo': 1, 'Tu': 2, 'We': 3, 'Th': 4, 'Fr': 5, 'Sa': 6
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

export const restaurantUrlMap = {
  "anteatery": "the-anteatery",
  "brandywine": "brandywine",
} as const;

const parseEventDate = (dateStr: string, time: string) => {
  return new Date(`${dateStr}T${time}`)
}