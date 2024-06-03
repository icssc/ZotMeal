import type { Drizzle, Event } from "@zotmeal/db";
import { EventTable } from "@zotmeal/db";
import { getRestaurantNameById, restaurantIds } from "@zotmeal/utils";

import { logger } from "../../logger";
import { upsertRestaurant } from "../restaurants/services";

export async function upsertEvents(
  db: Drizzle,
  events: Event[],
): Promise<Event[]> {
  try {
    // Upsert restaurants first
    const upsertRestaurantsResult = await Promise.allSettled(
      restaurantIds.map(
        async (id) =>
          await upsertRestaurant(db, { id, name: getRestaurantNameById(id) }),
      ),
    );

    upsertRestaurantsResult.forEach((result) => {
      if (result.status === "rejected") {
        logger.error(
          "upsertEvents(): upsertRestaurant() failed:",
          result.reason,
        );
      }
    });

    // Upsert events
    const upsertEventsResults = await Promise.allSettled(
      events.map(async (event) =>
        db
          .insert(EventTable)
          .values(event)
          .onConflictDoUpdate({
            target: [
              EventTable.title,
              EventTable.start,
              EventTable.restaurantId,
            ],
            set: event,
          })
          .returning(),
      ),
    );

    const upsertedEvents: Event[] = [];

    upsertEventsResults.forEach((result) => {
      if (result.status === "rejected")
        logger.error("upsertEvents(): upsert() failed:", result.reason);

      if (result.status === "fulfilled") {
        const upsertedEvent = result.value[0];

        if (upsertedEvent) upsertedEvents.push(upsertedEvent);
      }
    });

    return upsertedEvents;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
