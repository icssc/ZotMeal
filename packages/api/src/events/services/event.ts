import type { Drizzle, Event } from "@zotmeal/db";
import { EventTable } from "@zotmeal/db/src/schema";

export async function upsertEvents(
  db: Drizzle,
  events: Event[],
): Promise<Event[]> {
  try {
    // batch upsert events
    const upsertPromises = [];
    for (const e of events) {
      const upsert = db
        .insert(EventTable)
        .values(e)
        .onConflictDoUpdate({
          // upsert
          target: [EventTable.title, EventTable.start, EventTable.restaurantId],
          set: e,
        })
        .returning();
      upsertPromises.push(upsert);
    }
    const upsertedEvents: Event[] = (await Promise.all(upsertPromises)).flat();
    return upsertedEvents;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
