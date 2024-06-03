import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { DishTable } from "./dish-table";
import { UserTable } from "./user-table";
import { metadataColumns } from "./utils";

export const PinTable = pgTable(
  "pins",
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
 * {@linkcode DishTable}
 * {@linkcode UserTable}
 */
export const pinRelations = relations(PinTable, ({ one }) => ({
  dish: one(DishTable, {
    fields: [PinTable.dishId],
    references: [DishTable.id],
  }),
  user: one(UserTable, {
    fields: [PinTable.userId],
    references: [UserTable.id],
  }),
}));

export type Pin = typeof PinTable.$inferInsert;
