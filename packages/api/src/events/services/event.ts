import type {
  PrismaClientWithAccelerate,
  TransactionClientWithAccelerate,
} from "@zotmeal/db";

import type { EventParams } from "../models";

export async function createEvents(
  db: PrismaClientWithAccelerate | TransactionClientWithAccelerate,
  events: EventParams[],
) {
  try {
    // fetch any existing events that match any events passed in
    const existingEvents = await db.event.findMany({
      where: {
        OR: events.map((event) => ({
          title: event.title,
          date: event.date,
          link: event.link,
        })),
      },
    });

    // filter out existing events
    const newEvents = events.filter(
      (event) =>
        !existingEvents.some(
          (existingEvent) =>
            existingEvent.title === event.title &&
            existingEvent.link === event.link &&
            new Date(existingEvent.date).getTime() ===
              new Date(event.date).getTime(),
        ),
    );

    // insert new events
    if (newEvents.length > 0) {
      await db.event.createMany({
        data: newEvents,
      });
    }

    return newEvents;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
