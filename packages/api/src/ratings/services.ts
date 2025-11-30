import { upsert } from "@api/utils";
import { eq, avg, count, and, desc } from "drizzle-orm";

import type { Drizzle, InsertRating } from "@zotmeal/db";
import { ratings, dishes } from "@zotmeal/db";

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

export const deleteRating = async (db: Drizzle, userId: string, dishId: string) => {
  const result = await db
    .delete(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.dishId, dishId)))
    .returning({ dishId: ratings.dishId }); // Returns [{ dishId: '...' }]

  if (result.length === 0) {
    console.warn(`No rating found to delete for dish ${dishId} by user ${userId}.`);
  } else {
    console.log(`Rating for dish ${dishId} by user ${userId} deleted.`);
  }
  
  return { success: true, deletedDishId: dishId }; // Return a consistent object
};

export const getUserRatedDishes = async (db: Drizzle, userId: string) => {
  try {
    const allRatings = await db.query.ratings.findMany({
      where: (ratings, { eq }) => eq(ratings.userId, userId),
      orderBy: (ratings, { desc }) => [desc(ratings.updatedAt)], // Changed from createdAt
    });

    const enrichedResults = await Promise.all(
      allRatings.map(async (item) => {
        const dish = await db.query.dishes.findFirst({
          where: (dishes, { eq }) => eq(dishes.id, item.dishId),
          with: {
            station: {
              with: {
                restaurant: true,
              },
            },
          },
        });

        if (!dish) return null;

        return {
          ...dish,
          rating: item.rating,
          ratedAt: item.updatedAt, // Changed from createdAt - shows last update time
        };
      })
    );

    return enrichedResults.filter((item) => item !== null);
  } catch (error) {
    console.error("Error fetching rated dishes:", error);
    return [];
  }
};