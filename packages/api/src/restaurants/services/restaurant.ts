import type { Drizzle } from "@zotmeal/db";
import type { Restaurant } from "@zotmeal/db/src/schema";
import { RestaurantTable } from "@zotmeal/db/src/schema";

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

export async function getRestaurantById(
  db: Drizzle,
  id: string,
): Promise<Restaurant | undefined> {
  return await db.query.RestaurantTable.findFirst({
    where: (RestaurantTable, { eq }) => eq(RestaurantTable.id, id),
  });
}
