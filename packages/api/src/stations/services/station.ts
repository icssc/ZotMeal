import type { Drizzle, Station } from "@zotmeal/db";
import { StationTable } from "@zotmeal/db";

export async function upsertStation(
  db: Drizzle,
  params: Station,
): Promise<Station> {
  try {
    const upsertedStation = await db
      .insert(StationTable)
      .values(params)
      .onConflictDoUpdate({
        target: StationTable.id,
        set: params,
      })
      .returning();

    if (!upsertedStation || upsertedStation.length !== 1) {
      throw new Error(
        `expected 1 station to be upserted, but got ${upsertedStation.length}`,
      );
    }

    return upsertedStation[0]!;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
