import type { Drizzle } from "@zotmeal/db";
import type { Station } from "@zotmeal/db/src/schema";
import { StationTable } from "@zotmeal/db/src/schema";

export async function upsertStation(
  db: Drizzle,
  params: Station,
): Promise<Station | undefined> {
  try {
    const upsertedStation = await db
      .insert(StationTable)
      .values(params)
      .onConflictDoUpdate({
        target: StationTable.id,
        set: params,
      })
      .returning();

    if (upsertedStation.length !== 1) {
      throw new Error(
        `expected 1 station to be upserted, but got ${upsertedStation.length}`,
      );
    }

    return upsertedStation[0];
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
