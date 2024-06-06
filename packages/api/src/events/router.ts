import { createTRPCRouter, publicProcedure } from "../trpc";

/**
 * Get all events that are happening today or later.
 */
export const getEvents = publicProcedure.query(
  async ({ ctx: { db } }) =>
    await db.query.EventTable.findMany({
      where: (event, { gte }) => gte(event.end, new Date()),
    }),
);

export const eventRouter = createTRPCRouter({
  get: getEvents,
});
