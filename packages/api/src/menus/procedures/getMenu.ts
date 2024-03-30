import { TRPCError } from "@trpc/server";
import { MenuPeriodSchema, RestaurantSchema } from "@zotmeal/drizzle-db/src/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import type { GetMenuParams } from "../services";
import { getMenu } from "../services";

const GetMenuSchema = z.object({
  date: z.string(),
  periodName: MenuPeriodSchema.shape.name,
  restaurantName: RestaurantSchema.shape.name,
}) satisfies z.ZodType<GetMenuParams>;

export const getMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    const menu = await getMenu(db, input);

    if (menu === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "menu not found",
      });
    }
  });
