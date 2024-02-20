import { TRPCError } from "@trpc/server";

import { parseDate } from "@zotmeal/utils";

import { publicProcedure } from "../../trpc";
import { GetMenuSchema } from "../models/menu";

export const getMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx, input }) => {
    // get a menu
    const { date: dateString, period, restaurant: restaurantName } = input;
    const { db } = ctx;

    const restaurant = await db.restaurant.findFirst({
      where: {
        name: restaurantName,
      },
      include: {
        stations: false,
        menu: false,
      },
    });

    await db.menu.findMany({
      include: {
        stations: {
          include: {
            dishes: true,
          },
        },
        restaurant: {
          include: {},
        },
      },
    });

    // should 404
    if (restaurant === null) {
      throw new TRPCError({
        message: "restaurant not found",
        code: "NOT_FOUND",
      });
    }

    const date = parseDate(dateString);
    if (!date) {
      throw new TRPCError({
        message: `invalid date string ${dateString}`,
        code: "BAD_REQUEST",
      });
    }

    const menu = await db.menu.findFirst({
      where: {
        restaurantId: restaurant.id,
        date,
        period,
      },
      include: {
        restaurant: true,
        stations: true,
      },
    });
    if (!menu) {
      throw new TRPCError({
        message: `menu not found`,
        code: "NOT_FOUND",
      });
    }

    return menu;
  });
