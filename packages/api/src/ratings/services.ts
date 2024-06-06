import type { Drizzle, Rating } from "@zotmeal/db";
import { RatingTable } from "@zotmeal/db";

import { logger } from "../../logger";

export async function upsertRating(
  db: Drizzle,
  params: Rating,
): Promise<Rating> {
  logger.debug("upsertRating() params:", params);

  const ratingResult = await db
    .insert(RatingTable)
    .values(params)
    .onConflictDoUpdate({
      target: [RatingTable.dishId, RatingTable.userId],
      set: params,
    })
    .returning();

  const upsertedRating = ratingResult[0];

  if (!upsertedRating || ratingResult.length !== 1)
    throw new Error(
      `expected 1 rating to be upserted, but got ${ratingResult.length}`,
    );

  return upsertedRating;
}

// export async function getNumRatingsByDishId(db: Drizzle, dishId: string) {
//   const ratingCountResult = await db
//     .select({
//       count: count(),
//     })
//     .from(RatingTable)
//     .where(eq(RatingTable.dishId, dishId));

//   const ratingCount = ratingCountResult[0];

//   if (!ratingCount || ratingCountResult.length !== 1)
//     throw new Error(
//       `expected 1 rating to be upserted, but got ${ratingCountResult.length}`,
//     );

//   return ratingCount.count;
// }

// export async function getTotalRatingByDishId(db: Drizzle, dishId: string) {
//   const ratingSumResult = await db
//     .select({ value: sql<number>`sum(${RatingTable.rating})`.mapWith(Number) })
//     .from(RatingTable)
//     .where(eq(RatingTable.dishId, dishId));

//   const ratingSum = ratingSumResult[0];

//   if (!ratingSum || ratingSumResult.length !== 1)
//     throw new Error(
//       `expected 1 rating to be upserted, but got ${ratingSumResult.length}`,
//     );

//   return ratingSum.value;
// }
