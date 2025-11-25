import { upsert } from "@api/utils";
import { eq, avg, count, and } from "drizzle-orm";

import type { Drizzle, InsertRating } from "@zotmeal/db";
import { ratings } from "@zotmeal/db";

export const upsertRating = async (db: Drizzle, rating: InsertRating) =>
  await upsert(db, ratings, rating, {
    target: [ratings.userId, ratings.dishId],
    set: rating,
  });

export const getAverageRating = async (db: Drizzle, dishId: string) => {
  const result = await db
    .select({
      averageRating: avg(ratings.rating),
      ratingCount: count(ratings.rating),
    })
    .from(ratings)
    .where(eq(ratings.dishId, dishId));

  return {
    averageRating: result[0]?.averageRating ? Number(result[0].averageRating) : 0,
    ratingCount: result[0]?.ratingCount ?? 0,
  };
};

export const getUserRating = async (db: Drizzle, userId: string, dishId: string) => {
  const result = await db
    .select({ rating: ratings.rating })
    .from(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.dishId, dishId)))
    .limit(1);

  return result[0]?.rating ?? null;
};
