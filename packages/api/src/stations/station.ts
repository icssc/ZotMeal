import { station } from "@zotmeal/db/src/schema";
import type { Drizzle } from "@zotmeal/db";

type Station = typeof station.$inferInsert;

export async function upsertStation(
  db: Drizzle,
  params: Station,
): Promise<Station | undefined> {
  try {
    const upsertedStation = await db
      .insert(station)
      .values(params)
      .onConflictDoUpdate({
        target: station.id,
        set: params,
      })
      .returning();

    if (upsertedStation.length !== 1) {
      throw new Error(`expected 1 station to be upserted, but got ${upsertedStation.length}`);
    }

    return upsertedStation[0];
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
