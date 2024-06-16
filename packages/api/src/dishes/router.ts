import { upsertRating } from "@api/ratings/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { getUser } from "@api/users/services";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { dishes, RatingSchema } from "@zotmeal/db";

export const getDishProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    const dish = await db.query.dishes.findFirst({
      where: (dishes, { eq }) => eq(dishes.id, input.id),
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
  .mutation(async ({ ctx: { db }, input }) => {
    const dish = await db.query.dishes.findFirst({
      where: (dishes, { eq }) => eq(dishes.id, input.dishId),
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
      .update(dishes)
      .set({
        numRatings: newNumRatings,
        totalRating: newTotalRating,
      })
      .where(eq(dishes.id, rating.dishId))
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
  /**
   * Get a dish by its id.
   */
  get: getDishProcedure,
  /**
   * Rate a dish.
   */
  rate: rateDishProcedure,
});
