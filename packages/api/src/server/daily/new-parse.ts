import { RestaurantName } from "@zotmeal/db";
import { type LocationRecipes, type LocationInfo, GetLocationSchema, DiningHallInformation } from "@zotmeal/validators";
import { 
  graphQLEndpoint,
  graphQLHeaders,
  getLocationQuery, 
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

  // TODO: Build meal periods objects from:
  // - name, ids in Commerce_mealPeriods
  // - hours in aemAttributes/hoursOfOperation/schedule
}

/**  Fetches the Adobe ECommerce Menu specified. */
// export async function getAdobeEcommerceMenu(
//   date: Date,
//   restaurantName: RestaurantName,
//   periodId: string,
// ): Promise<LocationRecipes> {
//   ;
// }