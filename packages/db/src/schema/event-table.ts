import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { restaurantIds } from "@zotmeal/utils";

import { RestaurantTable } from "./restaurant-table";
import { metadataColumns } from "./utils";

const restaurantIdEnum = pgEnum("restaurant_id_enum", restaurantIds);

export const EventTable = pgTable(
  "events",
  {
    title: text("title").notNull(),
    image: text("image"),
    restaurantId: restaurantIdEnum("restaurant_id")
      .notNull()
      .references(() => RestaurantTable.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),

    ...metadataColumns,
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.title, table.restaurantId, table.start],
      }),
    };
  },
);

/**
 * Event has one:
 *
 * {@linkcode RestaurantTable}
 */
export const eventRelation = relations(EventTable, ({ one }) => ({
  restaurant: one(RestaurantTable, {
    fields: [EventTable.restaurantId],
    references: [RestaurantTable.id],
  }),
}));
export type Event = typeof EventTable.$inferInsert;
export const EventSchema = createInsertSchema(EventTable);
