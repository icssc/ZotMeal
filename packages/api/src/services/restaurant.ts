import type { PrismaClient, RestaurantName } from "@zotmeal/db";

export function updateRestaurant(db: PrismaClient) {
  // validate with zod
  const _ = db.restaurant.findFirst();
}

export function createRestaurant(db: PrismaClient) {

  // validate with zod

  const _ = db.restaurant.findFirst();

}

export async function getRestaurant(
  db: PrismaClient,
  name: RestaurantName,
) {
  try {
    const restaurant = await db.restaurant.findFirst({
      where: {
        name,
      },
      include: {
        stations: false,
        menu: false,
      },
    });

    return restaurant;
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error occurred while fetching restaurant:', e.message);
    }
    return null;
  }
}
