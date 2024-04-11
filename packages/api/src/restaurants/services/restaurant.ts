import type { Drizzle } from "@zotmeal/db";
import { restaurant } from "@zotmeal/db/src/schema";
import type { Restaurant } from "@zotmeal/db/src/schema";

export async function upsertRestaurant(
  db: Drizzle,
  params: Restaurant,
): Promise<Restaurant | undefined> {
  try {
    const upsertedRestaurant = await db
      .insert(restaurant)
      .values(params)
      .onConflictDoUpdate({
        target: restaurant.name,
        set: params,
      })
      .returning();

    if (upsertedRestaurant.length !== 1) {
      throw new Error(`expected 1 restaurant to be upserted, but got ${upsertedRestaurant.length}`);
    }

    return upsertedRestaurant[0];
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}

export async function getRestaurantById(
  db: Drizzle,
  id: string,
): Promise<Restaurant | undefined> {
  return await db.query.restaurant.findFirst({
    where: (restaurant, { eq }) => eq(restaurant.id, id),
  });
}
