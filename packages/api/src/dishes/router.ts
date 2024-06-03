import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { DishTable, RatingSchema } from "@zotmeal/db";

import {
  getNumRatingsByDishId,
  getTotalRatingByDishId,
  upsertRating,
} from "../ratings/services";
import { createTRPCRouter, publicProcedure } from "../trpc";

const GetRatingSchema = z.object({
  dishId: z.string(),
});

export const getRatingProcedure = publicProcedure
  .input(GetRatingSchema)
  .query(async ({ ctx: { db }, input: { dishId } }) => {
    const dish = await db.query.DishTable.findFirst({
      where: (DishTable, { eq }) => eq(DishTable.id, dishId),
    });

    if (!dish)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "dish not found",
      });

    return dish.totalRating / dish.numRatings;
  });

export const rateDishProcedure = publicProcedure
  .input(RatingSchema)
  .query(async ({ ctx: { db }, input }) => {
    const dish = await db.query.DishTable.findFirst({
      where: (DishTable, { eq }) => eq(DishTable.id, input.dishId),
    });

    if (!dish)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "dish not found",
      });

    const rating = await upsertRating(db, input);

    const numRatings = await getNumRatingsByDishId(db, input.dishId);
    const totalRating = await getTotalRatingByDishId(db, input.dishId);

    const updateDishResult = await db
      .update(DishTable)
      .set({
        numRatings,
        totalRating,
      })
      .where(eq(DishTable.id, rating.dishId))
      .returning();

    const updatedDish = updateDishResult[0];

    if (!updatedDish || updateDishResult.length !== 1)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "failed to update dish",
      });

    return updatedDish.numRatings;
  });

export const dishRouter = createTRPCRouter({
  getRating: getRatingProcedure,
  rate: rateDishProcedure,
});
