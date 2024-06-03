import { relations } from "drizzle-orm";
import { pgTable, primaryKey, smallint, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { DishTable } from "./dish-table";
import { UserTable } from "./user-table";
import { metadataColumns } from "./utils";

export const RatingTable = pgTable(
  "ratings",
  {
    userId: text("user_id")
      .notNull()
      .references(() => UserTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    dishId: text("dish_id")
      .notNull()
      .references(() => DishTable.id, {
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
 * {@linkcode UserTable}
 * {@linkcode DishTable}
 */
export const ratingRelations = relations(RatingTable, ({ one }) => ({
  dish: one(DishTable, {
    fields: [RatingTable.dishId],
    references: [DishTable.id],
  }),
  user: one(UserTable, {
    fields: [RatingTable.userId],
    references: [UserTable.id],
  }),
}));

export type Rating = typeof RatingTable.$inferInsert;

export const RatingSchema = createInsertSchema(RatingTable);
