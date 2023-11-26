import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { DEFAULT_PRICES } from "../util";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  try {
    // build the data we want to return to the client
    const data = {
      prices: DEFAULT_PRICES,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 4),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There is no pricing today",
      }),
    };
  }
};

export { handler };
