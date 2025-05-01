import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { dishRouter } from "./dishes/router";
import { eventRouter } from "./events/router";
import { notificationRouter } from "./notifications/router";
import { getRestaurantsByDate } from "./restaurants/services";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { userRouter } from "./users/router";

export const appRouter = createTRPCRouter({
  event: eventRouter,
  dish: dishRouter,
  notification: notificationRouter,
  user: userRouter,
  /** Returns "Hello, world!" */
  hello: publicProcedure.query(() => "Hello, world!"),
  /** Get all information about restaurants on a given date. */
  zotmeal: publicProcedure.input(z.object({ date: z.date() })).query(
    async ({ ctx: { db }, input: { date } }) =>
      await getRestaurantsByDate(db, date).catch((error) => {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching restaurants",
        });
      }),
  ),
});

// export type definition of API
export type AppRouter = typeof appRouter;