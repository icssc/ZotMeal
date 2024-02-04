import axios from "axios";
import { parse } from "date-fns";
import { z } from "zod";

import { MenuPeriod } from "@acme/db";
import { parse as parseCampusDish } from "@zotmeal/utils";
import {
  CampusDishResponseSchema,
  ParsedResponseSchema,
} from "@acme/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

// https://uci.campusdish.com/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024

// const locations = Object.values(LocationNames).map((name) => name.toString());

// enum RestaurantName {
//   brandywine,
//   anteatery
// }

// const locations = ["a", "b", "c"] as const;

const GetMenuSchema = z.object({
  date: z.string().regex(RegExp("/^d{2}/d{2}/d{4}$/")),
  period: z.nativeEnum(MenuPeriod),
  restaurant: z.string(),
});

const getMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx, input }) => {
    const _ = ctx;

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
    if (restaurant === null) {
      return null;
    }

    // 404 when the menu is not found
    // we either deleted it or its not yet fetched
    // do not allow the option to the client

    const date = parse(dateString, "MM/dd/yyyy", new Date());
    // get the rstaurant with this name

    const menu = await db.menu.findFirst({
      where: {
        restaurantId: restaurant.id,
        date: date,
        period: period,
      },
    });

    return menu;
  });

export const menuRouter = createTRPCRouter({
  get: getMenuProcedure,
  hello: publicProcedure.query(async ({ ctx }) => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log(res.data);
    console.log("hello");
    const _ = ctx;
    return "hello";
  }),
  parse: publicProcedure.query(async ({ ctx }) => {
    const res = await axios.get(
      "https://uci.campusdish.com/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
    );
    const validated = CampusDishResponseSchema.parse(res.data);
    const parsed = ParsedResponseSchema.parse(parseCampusDish(validated));
    const _ = ctx;
    return parsed;
  }),
});
