import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { periodNames, restaurantNames } from "@zotmeal/utils";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { getMenu } from "./services";

export const getMenuProcedure = publicProcedure
  .input(
    z.object({
      date: z.date(),
      period: z.enum(periodNames),
      restaurant: z.enum(restaurantNames),
    }),
  )
  .query(async ({ ctx: { db }, input: { date, period, restaurant } }) => {
    const menu = await getMenu(db, date, period, restaurant);

    if (!menu)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "menu not found",
      });

    return menu;
  });

export const menuRouter = createTRPCRouter({
  get: getMenuProcedure,
  hello: publicProcedure.query(() => "menu -> hello"),
});
