
import type { Drizzle } from "@zotmeal/db";
import { event } from "@zotmeal/db/src/schema";

type Event = typeof event.$inferInsert;

export async function upsertEvents(
  db: Drizzle,
  events: Event[],
): Promise<Event[] | undefined> {
  try {
    // batch upsert events
    const upsertPromises = [];
    for (const e of events) {
      const upsert = db
        .insert(event)
        .values(e)
        .onConflictDoUpdate({ // upsert
          target: [event.title, event.date, event.restaurant],
          set: e,
        })
        .returning()
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
