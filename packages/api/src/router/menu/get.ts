import { TRPCError } from "@trpc/server";
import { parse } from "date-fns";
import { z } from "zod";

import { MenuPeriod, RestaurantName } from "@zotmeal/db";

import { publicProcedure } from "../../trpc";

export const GetMenuSchema = z.object({
  date: z
    .string()
    .regex(
      RegExp(
        "^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$",
      ),
    ),
  period: z.nativeEnum(MenuPeriod),
  restaurant: z.nativeEnum(RestaurantName),
});

export type GetMenuParams = z.infer<typeof GetMenuSchema>;

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

    const date = parse(dateString, "MM/dd/yyyy", new Date());
    if (!date) {
      throw new TRPCError({
        message: `invalid date string ${dateString}`,
        code: "BAD_REQUEST",
      });
    }

    const menu = await db.menu.findFirst({
      where: {
        restaurantId: restaurant.id,
        date: date,
        period: period,
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
