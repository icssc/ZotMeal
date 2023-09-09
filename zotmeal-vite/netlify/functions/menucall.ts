import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const axios = require("axios");
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const location = event.queryStringParameters?.location;
  let location_id: string;
  if (location == "brandywine") {
    location_id = "3314";
  } else if (location == "anteatery") {
    location_id = "3056";
  }

  const meal = event.queryStringParameters?.meal;
  const meal_to_period = {
    breakfast: 49,
    lunch: 106,
    dinner: 107,
    brunch: 2651,
  };
  const meal_id = meal_to_period[meal];

  const date = event.queryStringParameters?.date;

  //  anteatery 01/14/2022 breakfast
  //  https://uci.campusdish.com/api/menu/GetMenus?locationId=3056&date=01/14/2022&periodId=49
  let apicallurl = `https://uci.campusdish.com/api/menu/GetMenus?locationId=${location_id}&date=${date}&periodId=${meal_id}`;

  try {
    const response = await axios.get(apicallurl);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There is no menu today",
      }),
    };
  }
};

export { handler };
