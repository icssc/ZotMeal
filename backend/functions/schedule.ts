import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import {
  LOCATION_ID,
  getMealPeriods,
} from "../util";

const axios = require("axios");
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const location = event.queryStringParameters?.location;
  const date = event.queryStringParameters?.date;

  const location_id = LOCATION_ID[location];

  //  anteatery 01/14/2022
  //  https://uci.campusdish.com/api/menu/GetMenus?locationId=3056&date=01/14/2022
  let apicallurl = `https://uci.campusdish.com/api/menu/GetMenus?locationId=${location_id}&date=${date}`;

  try {
    const response = await axios.get(apicallurl);

    // Turn schedule data into the format of {period: {start: time, end: time}
    const schedule = {};
    for (const period of response.data.Menu.MenuPeriods) {
      schedule[period.Name] = {
        start: getMealPeriods(period.UtcMealPeriodStartTime),
        end: getMealPeriods(period.UtcMealPeriodEndTime),
      };
    }

    // build the data we want to return to the client
    const data = {
      schedule: schedule,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 4),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There is no schedule today",
      }),
    };
  }
};

export { handler };
