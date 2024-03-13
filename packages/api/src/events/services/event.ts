
import { event } from "@zotmeal/drizzle-db/src/schema";
import type { EventParams } from "../models";
import type { Drizzle } from "@zotmeal/drizzle-db";

interface UpsertResponse {
  title: string;
  updatedAt: string;
}

export async function upsertEvents(
  db: Drizzle,
  events: EventParams[],
) {
  try {
    // batch upsert events
    const upsertPromises = [];
    for (const e of events) {
      const upsert = db
        .insert(event)
        .values(e)
        .onConflictDoUpdate({
          target: [event.title, event.date, event.restaurant],
          set: {
            title: e.title,
            date: e.date,
            restaurant: e.restaurant,
            image: e.image,
            description: e.description,
          },
        })
        .returning({
          title: event.title,
          updatedAt: event.updatedAt
        })
      upsertPromises.push(upsert);
    }
    const upsertedEvents: UpsertResponse[][] = await Promise.all(upsertPromises);

    console.log("upsertedEvents:", upsertedEvents);

    return upsertedEvents;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
