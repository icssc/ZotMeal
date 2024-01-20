import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// should be get only
import MenuService from "../../services/MenuService";
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const location = event.queryStringParameters?.['location'];
  const mealPeriod = event.queryStringParameters?.['mealPeriod'];
  const dateString = event.queryStringParameters?.['date'];


  if (!location || !mealPeriod || !dateString) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "must provide 'location', 'meal', and 'date'",
      }),
    };
  }

  try {
    console.log(dateString);

    const date = new Date(dateString);

    console.log(date);
    console.log(location, date, mealPeriod);

    const stationItems = await MenuService.getMenu({ location, date, mealPeriod });

    // build the data we want to return to the client
    const response = {
      all: stationItems
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response, null, 4),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There is no menu today",
      }),
    };
  }
};

export { handler };
