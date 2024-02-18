import { Expo } from "expo-server-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

// import { z } from "zod";

import { broadcastNotification, Notification } from "@zotmeal/api";
import { PrismaClient } from "@zotmeal/db";
import { EventSchema } from "@zotmeal/validators";

export const main: APIGatewayProxyHandlerV2 = (evt, context) => {
  // private handler
  // special event
  const event = EventSchema.parse(evt.body);
  console.log("Broadcasting event notification");

  const db = new PrismaClient();
  const expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
  });

  // We should format the event subtitle to be something like "Brandywine is holding a special event"
  // Title: Special Event at {restaurant_name}
  // Subtitle: event.description

  const notification: Notification = {
    title: event.title,
    subtitle: event.description,
    body: event.description,
  };

  broadcastNotification(db, expo, notification);
};
