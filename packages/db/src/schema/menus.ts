import { relations } from "drizzle-orm";
import { date, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { restaurantIdEnum } from "./enums";
import { periods } from "./periods";
import { restaurants } from "./restaurants";
import { metadataColumns } from "./utils";

export const menus = pgTable("menus", {
  id: text("id").primaryKey(),
  periodId: text("period_id")
    .notNull()
    .references(() => periods.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  date: date("date", { mode: "string" }).notNull(),
  restaurantId: restaurantIdEnum("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  price: text("price").notNull(),
  ...metadataColumns,
});

export const menusRelations = relations(menus, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menus.restaurantId],
    references: [restaurants.id],
  }),
  period: one(periods, {
    fields: [menus.periodId],
    references: [periods.id],
  }),
  dishesToMenus: many(dishesToMenus),
}));

/**
 * TODO: drizzle's upcoming relational api v2 will allow us to just specify a M2M relation
 * within the relations function above. Until then, it's a join table
 *
 * @see https://github.com/drizzle-team/drizzle-orm/discussions/2316
 *
 * @see https://orm.drizzle.team/docs/joins#many-to-many-example
 */
export const dishesToMenus = pgTable(
  "dishes_to_menus",
  {
    menuId: text("menu_id")
      .notNull()
      .references(() => menus.id),
    dishId: text("dish_id")
      .notNull()
      .references(() => dishes.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.menuId, table.dishId] }),
  }),
);

export const dishesToMenusRelations = relations(dishesToMenus, ({ one }) => ({
  dish: one(dishes, {
    fields: [dishesToMenus.dishId],
    references: [dishes.id],
  }),
  menu: one(menus, {
    fields: [dishesToMenus.menuId],
    references: [menus.id],
  }),
}));

export type Menu = typeof menus.$inferInsert;
export type DishToMenu = typeof dishesToMenus.$inferInsert;
