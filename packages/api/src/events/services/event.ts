import type { Drizzle } from "@zotmeal/db";
import { EventTable } from "@zotmeal/db/src/schema";

type Event = typeof EventTable.$inferInsert;

export async function upsertEvents(
  db: Drizzle,
  events: Event[],
): Promise<Event[] | undefined> {
  try {
    // batch upsert events
    const upsertPromises = [];
    for (const e of events) {
      const upsert = db
        .insert(EventTable)
        .values(e)
        .onConflictDoUpdate({
          // upsert
          target: [EventTable.title, EventTable.date, EventTable.restaurantId],
          set: e,
        })
        .returning();
      upsertPromises.push(upsert);
    }
    const upsertedEvents: Event[] = (await Promise.all(upsertPromises)).flat();
    return upsertedEvents;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
