import { upsert } from "@api/utils";

import type { Drizzle, InsertRating } from "@peterplate/db";
import { ratings } from "@peterplate/db";

export const upsertRating = async (db: Drizzle, rating: InsertRating) =>
  await upsert(db, ratings, rating, {
    target: [ratings.userId, ratings.dishId],
    set: rating,
  });
