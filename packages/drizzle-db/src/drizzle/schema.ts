import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const menuPeriodName = pgEnum("MenuPeriodName", [
  "latenight",
  "dinner",
  "lunch",
  "brunch",
  "breakfast",
]);
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

export const menuPeriod = pgTable(
  "MenuPeriod",
  {
    id: text("id").primaryKey().notNull(),
    name: menuPeriodName("name").notNull(),
    start: timestamp("start", { precision: 3, mode: "string" }).notNull(),
    end: timestamp("end", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("MenuPeriod_name_key").on(table.name),
    };
  },
);

export const menu = pgTable("Menu", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  periodId: text("periodId")
    .notNull()
    .references(() => menuPeriod.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  date: timestamp("date", { precision: 3, mode: "string" }).notNull(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => restaurant.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const dietRestriction = pgTable("DietRestriction", {
  dishId: text("dishId")
    .primaryKey()
    .notNull()
    .references(() => dish.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  containsFish: boolean("containsFish"),
  containsMilk: boolean("containsMilk"),
  containsPeanuts: boolean("containsPeanuts"),
  containsSesame: boolean("containsSesame"),
  containsShellfish: boolean("containsShellfish"),
  containSoy: boolean("containSoy"),
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

export const nutritionInfo = pgTable("NutritionInfo", {
  dishId: text("dishId")
    .primaryKey()
    .notNull()
    .references(() => dish.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  servingSize: text("servingSize"),
  servingUnit: text("servingUnit"),
  calories: text("calories"),
  caloriesFromFat: text("caloriesFromFat"),
  totalFat: text("totalFat"),
  transFat: text("transFat"),
  cholesterol: text("cholesterol"),
  sodum: text("sodum"),
  totalCarbohydrates: text("totalCarbohydrates"),
  dietaryFiber: text("dietaryFiber"),
  sugars: text("sugars"),
  protein: text("protein"),
  vitaminA: text("vitaminA"),
  vitaminC: text("vitaminC"),
  calcium: text("calcium"),
  iron: text("iron"),
  saturatedFat: text("saturatedFat"),
});

export const pushToken = pgTable("PushToken", {
  token: text("token").primaryKey().notNull(),
});

export const station = pgTable("Station", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => restaurant.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  menuId: text("menuId")
    .notNull()
    .references(() => menu.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const dish = pgTable("Dish", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stationId: text("stationId")
    .notNull()
    .references(() => station.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const event = pgTable(
  "Event",
  {
    title: text("title").notNull(),
    link: text("link").notNull(),
    description: text("description").notNull(),
    date: timestamp("date", { precision: 3, mode: "string" }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      eventPkey: primaryKey({
        columns: [table.title, table.link, table.date],
        name: "Event_pkey",
      }),
    };
  },
);

// * Relations Summary:
// * Restaurant <- Station: One-to-Many (One restaurant has many stations).
// * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
// * MenuPeriod <- Menu: One-to-Many (One menu period can be associated with many menus).
// * Menu <- Station <- Dish: one menu have many station and one station have many dish
// * Dish ↔ DietRestriction: One-to-One (Each dish has a set of diet restrictions).
// * Dish ↔ NutritionInfo: One-to-One (Each dish has nutritional information).

export const dishRelations = relations(dish, ({ one }) => ({
  // * Dish ↔ DietRestriction: One-to-One (Each dish has a set of diet restrictions).
  dietRestriction: one(dietRestriction, {
    fields: [dish.id],
    references: [dietRestriction.dishId],
  }),
  // * Dish ↔ NutritionInfo: One-to-One (Each dish has nutritional information).
  nutritionInfo: one(nutritionInfo, {
    fields: [dish.id],
    references: [nutritionInfo.dishId],
  }),
  // * Station <- Dish: One-to-Many (Each station has a set of dishes).
  station: one(station, { fields: [dish.stationId], references: [station.id] }),
}));

export const stationRelations = relations(station, ({ one, many }) => ({
  // * Station <- Dish: One-to-Many (Each station has a set of dishes).
  dish: many(dish),
  // * Menu <- Station: One-to-Many (Each menu has many stations).
  menu: one(menu, {
    fields: [station.menuId],
    references: [menu.id],
  }),
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  restaurant: one(restaurant, {
    fields: [station.restaurantId],
    references: [restaurant.id],
  }),
}));

export const menuRelations = relations(menu, ({ one, many }) => ({
  // * Menu <- Station: One-to-Many (Each menu has many stations).
  station: many(station),
  // * MenuPeriod <- Menu: One-to-Many (One menu period can be associated with many menus).
  menuPeriod: one(menuPeriod, {
    fields: [menu.periodId],
    references: [menuPeriod.id],
  }),
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  restaurant: one(restaurant, {
    fields: [menu.restaurantId],
    references: [restaurant.id],
  }),
}));

export const menuPeriodRelations = relations(menuPeriod, ({ many }) => ({
  // * MenuPeriod <- Menu: One-to-Many (One menu period can be associated with many menus).
  menu: many(menu),
}));

export const restaurantRelations = relations(restaurant, ({ many }) => ({
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  station: many(station),
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  menu: many(menu),
}));
