import { boolean, pgTable, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { metadataColumns } from "./utils";

export const dietRestrictions = pgTable("diet_restrictions", {
  dishId: text("dish_id")
    .primaryKey()
    .references(() => dishes.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  containsEggs: boolean("contains_eggs"),
  containsFish: boolean("contains_fish"),
  containsMilk: boolean("contains_milk"),
  containsPeanuts: boolean("contains_peanuts"),
  containsSesame: boolean("contains_sesame"),
  containsShellfish: boolean("contains_shellfish"),
  containsSoy: boolean("contains_soy"),
  containsTreeNuts: boolean("contains_tree_nuts"),
  containsWheat: boolean("contains_wheat"),
  ...metadataColumns,
});

/** The diet restrictions of a dish. */
export type InsertDietRestriction = typeof dietRestrictions.$inferInsert;
export type SelectDietRestriction = typeof dietRestrictions.$inferSelect;
