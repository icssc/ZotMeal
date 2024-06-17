import { upsert } from "@api/utils";

import type { Drizzle, Rating } from "@zotmeal/db";
import { ratings } from "@zotmeal/db";

export const upsertRating = async (db: Drizzle, rating: Rating) =>
  await upsert(db, ratings, rating, {
    target: [ratings.userId, ratings.dishId],
    set: rating,
  });
