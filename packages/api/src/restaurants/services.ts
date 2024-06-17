import { upsert } from "@api/utils";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";

import type {
  DietRestriction,
  Dish,
  Drizzle,
  Event,
  Menu,
  NutritionInfo,
  Period,
  Restaurant,
  Station,
} from "@zotmeal/db";
import { restaurants } from "@zotmeal/db";

export const upsertRestaurant = async (db: Drizzle, restaurant: Restaurant) =>
  await upsert(db, restaurants, restaurant, {
    target: restaurants.id,
    set: restaurant,
  });

interface RestaurantInfo extends Restaurant {
  events: Event[];
  menus: (Menu & {
    period: Period;
    stations: (Station & {
      dishes: (Dish & {
        menuId: Menu["id"];
        restaurant: Restaurant["name"];
        dietRestriction: DietRestriction;
        nutritionInfo: NutritionInfo;
      })[];
    })[];
  })[];
}

interface ZotmealData {
  anteatery: RestaurantInfo;
  brandywine: RestaurantInfo;
}

/**
 * Get menus and events for each restaurant. Fetches menus that correspond to the
 * given date and events that are happening today or later.
 */
export async function getRestaurantsByDate(
  db: Drizzle,
  date: Date,
): Promise<ZotmealData> {
  const restaurants = await db.query.restaurants.findMany({
    with: {
      menus: {
        where: (menus, { eq }) => eq(menus.date, format(date, "yyyy-MM-dd")),
        with: {
          period: true,
          dishesToMenus: {
            with: {
              dish: {
                with: {
                  dietRestriction: true,
                  nutritionInfo: true,
                },
              },
            },
          },
        },
      },
      events: {
        where: (events, { gte }) => gte(events.end, new Date()),
      },
      stations: true,
    },
  });

  // Transform data to the expected format
  const [firstRestaurant, secondRestaurant] = restaurants.map(
    ({ menus, events, stations, ...restaurant }) => ({
      ...restaurant,
      menus: menus
        .map(({ period, dishesToMenus, ...menu }) => ({
          ...menu,
          /** Only include stations that have dishes */
          stations: stations
            .map((station) => ({
              ...station,
              dishes: dishesToMenus
                .map((dishToMenu) => ({
                  ...dishToMenu.dish,
                  menuId: menu.id,
                  restaurant: restaurant.name,
                }))
                .filter((dish) => dish.stationId === station.id),
            }))
            .filter((station) => station.dishes.length),
          // ? include this if we want a flat list of dishes
          // dishes: dishesToMenus.map((dishToMenu) => dishToMenu.dish),
          period,
        }))
        .sort((a, b) => a.period.startTime.localeCompare(b.period.startTime)),
      events,
      stations,
    }),
  );

  if (!firstRestaurant || !secondRestaurant)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Restaurants not found, there should always be two restaurants",
    });

  return firstRestaurant.name === "anteatery"
    ? {
        anteatery: firstRestaurant,
        brandywine: secondRestaurant,
      }
    : {
        anteatery: secondRestaurant,
        brandywine: firstRestaurant,
      };
}
