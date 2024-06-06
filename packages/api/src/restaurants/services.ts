import type { Drizzle, Restaurant } from "@zotmeal/db";
import { RestaurantTable } from "@zotmeal/db";

export async function upsertRestaurant(
  db: Drizzle,
  restaurant: Restaurant,
): Promise<Restaurant> {
  try {
    const upsertResult = await db
      .insert(RestaurantTable)
      .values(restaurant)
      .onConflictDoUpdate({
        target: RestaurantTable.id,
        set: restaurant,
      })
      .returning();

    const upsertedRestaurant = upsertResult[0];

    if (!upsertedRestaurant || upsertResult.length !== 1)
      throw new Error(
        `expected 1 restaurant to be upserted, but got ${upsertResult.length}`,
      );

    return upsertedRestaurant;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
