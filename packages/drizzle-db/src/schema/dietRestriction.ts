import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { dish } from "./dish";

export const dietRestriction = pgTable("DietRestriction", {
  dishId: text("dishId")
    .primaryKey()
    .notNull()
    .references(() => dish.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  containsEggs: boolean("containsEggs"),
  containsFish: boolean("containsFish"),
  containsMilk: boolean("containsMilk"),
  containsPeanuts: boolean("containsPeanuts"),
  containsSesame: boolean("containsSesame"),
  containsShellfish: boolean("containsShellfish"),
  containsSoy: boolean("containsSoy"),
  containsTreeNuts: boolean("containsTreeNuts"),
  containsWheat: boolean("containsWheat"),
  isGlutenFree: boolean("isGlutenFree"),
  isHalal: boolean("isHalal"),
  isKosher: boolean("isKosher"),
  isLocallyGrown: boolean("isLocallyGrown"),
  isOrganic: boolean("isOrganic"),
  isVegan: boolean("isVegan"),
  isVegetarian: boolean("isVegetarian"),
});

export type DietRestriction = typeof dietRestriction.$inferInsert;
