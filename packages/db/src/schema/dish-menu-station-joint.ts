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
