import { pgEnum } from "drizzle-orm/pg-core";

export const restaurantIdEnum = pgEnum("restaurant_id_enum", ["3056", "3314"]);
export const restaurantNameEnum = pgEnum("restaurant_name_enum", [
  "anteatery",
  "brandywine",
]);

export const restaurantIds = restaurantIdEnum.enumValues;
export const restaurantNames = restaurantNameEnum.enumValues;

export type RestaurantId = (typeof restaurantIds)[number];
export type RestaurantName = (typeof restaurantNames)[number];

export const getRestaurantId = (name: RestaurantName) =>
  name === restaurantNames[0] ? restaurantIds[0] : restaurantIds[1];
export const getRestaurantNameById = (id: RestaurantId) =>
  id === restaurantIds[0] ? restaurantNames[0] : restaurantNames[1];
