import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { DishTable } from "./dish-table";
import { MenuTable } from "./menu-table";
import { StationTable } from "./station-table";

export const DishMenuStationJoint = pgTable("dish_menu_station_joint", {
  dishId: text("dish_id")
    .notNull()
    .references(() => DishTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  menuId: text("menu_id")
    .notNull()
    .references(() => MenuTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  stationId: text("station_id")
    .notNull()
    .references(() => StationTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const dishMenuStationRelations = relations(
  DishMenuStationJoint,
  ({ one }) => ({
    dish: one(DishTable, {
      fields: [DishMenuStationJoint.dishId],
      references: [DishTable.id],
    }),
    menu: one(MenuTable, {
      fields: [DishMenuStationJoint.menuId],
      references: [MenuTable.id],
    }),
    station: one(StationTable, {
      fields: [DishMenuStationJoint.stationId],
      references: [StationTable.id],
    }),
  }),
);

export type DishMenuStationJointSchema = typeof DishMenuStationJoint.$inferInsert;