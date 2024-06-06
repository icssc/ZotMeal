import type { Drizzle, Event } from "@zotmeal/db";
import { EventTable } from "@zotmeal/db";
import { getRestaurantNameById, restaurantIds } from "@zotmeal/utils";

import { logger } from "../../logger";
import { upsertRestaurant } from "../restaurants/services";

export async function upsertEvent(db: Drizzle, event: Event): Promise<Event> {
  try {
    const result = await db
      .insert(EventTable)
      .values(event)
      .onConflictDoUpdate({
        target: [EventTable.title, EventTable.start, EventTable.restaurantId],
        set: event,
      })
      .returning();

    const upsertedEvent = result[0];

    if (!upsertedEvent || result.length !== 1)
      throw new Error(
        `expected 1 event to be upserted, but got ${result.length}`,
      );

    return upsertedEvent;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

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
      logger.error("upsertEvents(): upsertRestaurant() failed:", result.reason);
  });

  const upsertEventsResults = await Promise.allSettled(
    events.map(async (event) => upsertEvent(db, event)),
  );

  const upsertedEvents: Event[] = [];

  upsertEventsResults.forEach((result) => {
    if (result.status === "rejected")
      logger.error("upsertEvents(): upsertEvent() failed:", result.reason);

    if (result.status === "fulfilled") upsertedEvents.push(result.value);
  });

  return upsertedEvents;
}
