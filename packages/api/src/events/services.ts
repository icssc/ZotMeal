import { logger } from "@api/logger";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsert } from "@api/utils";

import type { Drizzle, Event } from "@zotmeal/db";
import { events, getRestaurantNameById, restaurantIds } from "@zotmeal/db";

export const upsertEvent = async (db: Drizzle, event: Event) =>
  await upsert(db, events, event, {
    target: [events.title, events.start, events.restaurantId],
    set: event,
  });

export async function upsertEvents(
  db: Drizzle,
  events: Event[],
): Promise<Event[]> {
  // Upsert restaurants first
  const upsertRestaurantsResult = await Promise.allSettled(
    restaurantIds.map(
      async (id) =>
        await upsertRestaurant(db, { id, name: getRestaurantNameById(id) }),
    ),
  );

  upsertRestaurantsResult.forEach((result) => {
    if (result.status === "rejected")
      logger.error(result, "upsertEvents(): upsertRestaurant() failed:");
  });

  const upsertEventsResults = await Promise.allSettled(
    events.map(async (event) => upsertEvent(db, event)),
  );

  const upsertedEvents: Event[] = [];

  upsertEventsResults.forEach((result) => {
    if (result.status === "rejected")
      logger.error(result, "upsertEvents(): upsertEvent() failed:");

    if (result.status === "fulfilled") upsertedEvents.push(result.value);
  });

  return upsertedEvents;
}
