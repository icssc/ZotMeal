import type { Drizzle, Restaurant } from "@zotmeal/db";
import { RestaurantTable } from "@zotmeal/db";

export async function upsertRestaurant(
  db: Drizzle,
  params: Restaurant,
): Promise<Restaurant> {
  try {
    const upsertedRestaurant = await db
      .insert(RestaurantTable)
      .values(params)
      .onConflictDoUpdate({
        target: RestaurantTable.id,
        set: params,
      })
      .returning();

    if (upsertedRestaurant.length !== 1) {
      throw new Error(
        `expected 1 restaurant to be upserted, but got ${upsertedRestaurant.length}`,
      );
    }

    return upsertedRestaurant[0]!;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
