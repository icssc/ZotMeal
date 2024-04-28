import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { DishTable } from "./dish-table";
import { MenuTable } from "./menu-table";
import { StationTable } from "./station-table";

export const DishMenuStationJointTable = pgTable(
  "dish_menu_station_joint",
  {
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
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.dishId, table.menuId, table.stationId],
      }),
    };
  },
);

/**
 * DishMenuStationJoint has one:
 *
 * {@linkcode DishTable}
 * {@linkcode MenuTable}
 * {@linkcode StationTable}
 */
export const dishMenuStationRelations = relations(
  DishMenuStationJointTable,
  ({ one }) => ({
    dish: one(DishTable, {
      fields: [DishMenuStationJointTable.dishId],
      references: [DishTable.id],
    }),
    menu: one(MenuTable, {
      fields: [DishMenuStationJointTable.menuId],
      references: [MenuTable.id],
    }),
    station: one(StationTable, {
      fields: [DishMenuStationJointTable.stationId],
      references: [StationTable.id],
    }),
  }),
);

export type DishMenuStationJoint =
  typeof DishMenuStationJointTable.$inferInsert;
