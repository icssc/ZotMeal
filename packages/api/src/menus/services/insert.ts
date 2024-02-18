import type { Prisma, PrismaClient } from "@zotmeal/db";

import type { MenuModel } from "../models/menu";
import type { GetMenuParams } from "../procedures/get";
import { getRestaurant } from "../../restaurants/services/restaurant";
import { parseDate } from "../../utils/date";
import { getMenu, parseMenu } from "./parse";

export async function insertMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetMenuParams,
): Promise<MenuModel | null> {
  const { date: dateString, period, restaurant: restaurantName } = params;

  const date = parseDate(dateString);
  if (!date) {
    console.error("invalid date", dateString);
    return null;
  }

  const restaurant = await getRestaurant(db, restaurantName);
  if (!restaurant) {
    console.error("restaurant not found: ", restaurantName);
    return null;
  }

  const parsedMenu = await parseMenu(db, params);
  if (!parsedMenu) {
    console.error("failed to parse menu");
    return null;
  }

  // format data for db insertion
  const data = {
    id: parsedMenu.id,
    period,
    date,
    start: new Date(parsedMenu.start),
    end: new Date(parsedMenu.end),
    restaurant: {
      connect: {
        id: restaurant.id,
      },
    },
    stations: {
      create: parsedMenu.stations.map((station) => {
        return {
          id: station.id,
          name: station.name,
          restaurant: {
            connect: {
              id: restaurant.id,
            },
          },
          dishes: {
            create: parsedMenu.dishes
              .filter((dish) => {
                dish.stationId === station.id;
              })
              .map((dish) => {
                return {
                  id: dish.id,
                  description: dish.description,
                  name: dish.name,
                  station: {
                    connect: {
                      id: station.id,
                    },
                  },
                };
              }),
          },
        };
      }),
    },
  };

  // check if menu already exists
  const existingMenu = await getMenu(db, params);

  if (existingMenu) {
    console.error("menu already exists");
    throw new Error("DuplicateDataError");
  }

  try {
    const insertedMenu = await db.menu.create({
      data,
      include: {
        restaurant: true,
        stations: {
          include: {
            dishes: true,
          },
        },
      },
    });

    return insertedMenu;
  } catch (e) {
    console.error("failed to insert menu", e);
    throw new Error("DBResponseError");
  }
}
