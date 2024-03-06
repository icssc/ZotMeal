import { pgEnum, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";

export const restaurantName = pgEnum("RestaurantName", [
  "anteatery",
  "brandywine",
]);

export const restaurant = pgTable(
  "Restaurant",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
    name: restaurantName("name").notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("Restaurant_name_key").on(table.name),
    };
  },
);
