import { upsert } from "@api/utils";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

import type { Drizzle, InsertFavorite, SelectFavorite } from "@zotmeal/db";
import { favorites, dishes } from "@zotmeal/db";

/**
 * Get all favorites for a given user ID.
 * Returns empty array if the user has no favorites.
 */
export async function getFavorites(
  db: Drizzle,
  userId: string,
) {
  const userFavorites = await db.query.favorites.findMany({
    where: (favorites, { eq }) => eq(favorites.userId, userId),
    with: {
      dish: {
        with: {
          dietRestriction: true,
          nutritionInfo: true,
        },
      },
    },
  });

  // findMany always returns an array, so we can return it directly
  return userFavorites;
}

/**
 * Add a favorite for a given dish ID and user ID.
 * If a favorite already exists, no change is made (idempotent).
 */
export async function addFavorite(
  db: Drizzle,
  userId: string,
  dishId: string,
): Promise<SelectFavorite> {
  // Check if dish exists
  const dish = await db.query.dishes.findFirst({
    where: (dishes, { eq }) => eq(dishes.id, dishId),
  });

  if (!dish) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "dish not found",
    });
  }

  // Upsert the favorite (idempotent - if exists, no change)
  const favorite = await upsert(
    db,
    favorites,
    {
      userId,
      dishId,
    },
    {
      target: [favorites.userId, favorites.dishId],
      set: {
        userId,
        dishId,
      },
    },
  );

  return favorite;
}

/**
 * Delete a favorite for a given dish ID and user ID.
 * If the favorite does not exist, no change is made (idempotent).
 */
export async function deleteFavorite(
  db: Drizzle,
  userId: string,
  dishId: string,
): Promise<void> {
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.dishId, dishId)));
}

