// Private cron job for prefetching the menu for seven days from now and saving it in the db

// Scheduled job on netlify that runs every day at 6am. Fetches and saves the menu from one week from today and stores it in firebase realtime



import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

export { handler };
