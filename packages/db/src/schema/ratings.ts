import { relations } from "drizzle-orm";
import { pgTable, primaryKey, smallint, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { dishes } from "./dishes";
import { users } from "./users";
import { metadataColumns } from "./utils";

export const ratings = pgTable(
  "ratings",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    dishId: text("dish_id")
      .notNull()
      .references(() => dishes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    rating: smallint("rating").notNull(),
    ...metadataColumns,
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.dishId],
      }),
    };
  },
);

/**
 * Rating has one:
 *
 * {@linkcode users}
 * {@linkcode dishes}
 */
export const ratingsRelations = relations(ratings, ({ one }) => ({
  dish: one(dishes, {
    fields: [ratings.dishId],
    references: [dishes.id],
  }),
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
}));

export type Rating = typeof ratings.$inferInsert;

export const RatingSchema = createInsertSchema(ratings);
