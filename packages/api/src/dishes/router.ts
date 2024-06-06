import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { DishTable, RatingSchema } from "@zotmeal/db";

import { upsertRating } from "../ratings/services";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getUser } from "../users/services";

export const getDishProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    const dish = await db.query.DishTable.findFirst({
      where: (DishTable, { eq }) => eq(DishTable.id, input.id),
    });

    if (!dish)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "dish not found",
      });

    return dish;
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

    const user = await getUser(db, input.userId);

    const oldRating = user.ratings.find((rating) => rating.dishId === dish.id);

    await upsertRating(db, input);

    const newNumRatings = dish.numRatings + (oldRating ? 0 : 1);

    const newTotalRating =
      dish.totalRating + (input.rating - (oldRating?.rating ?? 0));

    const rating = await upsertRating(db, input);

    const updateDishResult = await db
      .update(DishTable)
      .set({
        numRatings: newNumRatings,
        totalRating: newTotalRating,
      })
      .where(eq(DishTable.id, rating.dishId))
      .returning();

    const updatedDish = updateDishResult[0];

    if (!updatedDish || updateDishResult.length !== 1)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "failed to update dish",
      });

    return rating;
  });

export const dishRouter = createTRPCRouter({
  get: getDishProcedure,
  rate: rateDishProcedure,
});
