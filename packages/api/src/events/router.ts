import { createTRPCRouter, publicProcedure } from "@api/trpc";

export const eventRouter = createTRPCRouter({
  /**
   * Get all events that are happening today or later.
   */
  getAllUpcoming: publicProcedure.query(
    async ({ ctx: { db } }) =>
      await db.query.events.findMany({
        where: (event, { gte }) => gte(event.end, new Date()),
      }),
  ),
});
