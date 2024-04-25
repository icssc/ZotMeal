import { Expo } from "expo-server-sdk";

import type { Notification } from "@zotmeal/api";
import { broadcastNotification } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";
import { EventSchema } from "@zotmeal/db/src/schema";

export const main = async (evt, _context) => {
  const db = await createDrizzle(process.env.DATABASE_URL);

  const event = EventSchema.parse(evt.body);
  console.log("Broadcasting event notification");

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

  const tickets = broadcastNotification(db, expo, notification);

  await pool({ connectionString: process.env.DATABASE_URL }).end();
};
