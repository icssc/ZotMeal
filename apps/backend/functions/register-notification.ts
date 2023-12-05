// Registers the user's device token to the database
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Register notification" }),
  };
};

export { handler };
