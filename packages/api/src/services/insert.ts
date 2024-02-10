import type { PrismaClient } from "@zotmeal/db";
import type { GetMenuParams } from "../router/menu/get";
import type { MenuModel } from "../models/menu";
import { parse } from "date-fns";
import { parseMenu } from "./menu";

export async function insertMenu(
  db: PrismaClient,
  params: GetMenuParams,
): Promise<MenuModel | null> {
  const {
    date: dateString,
    period,
    restaurant: restaurantName
  } = params;

  const restaurant = await db.restaurant.findFirst({
    where: {
      name: restaurantName,
    },
    include: {
      stations: false,
      menu: false,
    },
  });

  if (restaurant === null) {
    console.error("restaurant not found: ", restaurantName);
    return null;
  }

  const date = parse(dateString, "MM/dd/yyyy", new Date());

  if (!date) {
    console.error("invalid date", dateString);
    return null;
  }

  const parsedMenu = await parseMenu(db, params);

  if (!parsedMenu) {
    console.error("failed to parse menu");
    return null;
  }

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
              .filter((dish) => { dish.stationId === station.id })
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
                }
              }),
          },
        };
      }),
    },
  }

  const existingMenu = await db.menu.findFirst({
    where: {
      restaurantId: restaurant.id,
      date,
      period,
    },
  });

  if (existingMenu) {
    console.error("menu already exists");
    throw new Error("DuplicateDataError");
  }

  try {
    return await db.menu.create({
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
  } catch (e) {
    console.error("failed to insert menu", e);
    throw new Error("DBResponseError");
  }
}
