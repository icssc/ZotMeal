import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { RestaurantSchema } from "@zotmeal/db";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { getSchedule } from "./services";

export const getScheduleProcedure = publicProcedure
  .input(
    z.object({
      date: z.date(),
      restaurant: RestaurantSchema.shape.name,
    }),
  )
  .query(
    async ({ ctx: { db }, input: { date, restaurant } }) =>
      await getSchedule(db, date, restaurant).catch((e) => {
        if (e instanceof TRPCError) throw e;
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error getting schedule",
        });
      }),
  );

export const scheduleRouter = createTRPCRouter({
  get: getScheduleProcedure,
});
