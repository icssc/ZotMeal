import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../../trpc";
import { getMenu } from "../services";
import { DateRegex } from '@zotmeal/validators';
import { MenuSchema, RestaurantSchema } from '@zotmeal/db';

export const GetMenuSchema = z.object({
  date: DateRegex,
  period: MenuSchema.shape.period,
  restaurant: RestaurantSchema.shape.name,
});

export type GetMenuParams = z.infer<typeof GetMenuSchema>;
export const getMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx: { db }, input }) => {
    const menu = await getMenu(db, input);

    if (!menu) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "menu not found",
      });
    }

    return menu;
  });
