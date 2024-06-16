import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { users } from "./users";
import { metadataColumns } from "./utils";

export const pins = pgTable(
  "pins",
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
 * Pin has one:
 *
 * {@linkcode dishes}
 * {@linkcode users}
 */
export const pinsRelations = relations(pins, ({ one }) => ({
  dish: one(dishes, {
    fields: [pins.dishId],
    references: [dishes.id],
  }),
  user: one(users, {
    fields: [pins.userId],
    references: [users.id],
  }),
}));

export type Pin = typeof pins.$inferInsert;
