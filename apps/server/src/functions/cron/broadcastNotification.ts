import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";

import { broadcastNotification } from "@zotmeal/api";

export const main: APIGatewayProxyHandlerV2 = (event, context) => {
  event.body;
  // broadcastNotification();
};
