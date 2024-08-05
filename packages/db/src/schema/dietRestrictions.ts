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
  isGlutenFree: boolean("is_gluten_free"),
  isHalal: boolean("is_halal"),
  isKosher: boolean("is_kosher"),
  isLocallyGrown: boolean("is_locally_grown"),
  isOrganic: boolean("is_organic"),
  isVegan: boolean("is_vegan"),
  isVegetarian: boolean("is_vegetarian"),
  ...metadataColumns,
});

/** The diet restrictions of a dish. */
export type DietRestriction = typeof dietRestrictions.$inferInsert;
