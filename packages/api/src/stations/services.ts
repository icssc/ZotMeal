import type { Drizzle, Station } from "@zotmeal/db";
import { StationTable } from "@zotmeal/db";

export async function upsertStation(
  db: Drizzle,
  params: Station,
): Promise<Station> {
  try {
    const upsertResult = await db
      .insert(StationTable)
      .values(params)
      .onConflictDoUpdate({
        target: StationTable.id,
        set: params,
      })
      .returning();

    const upsertedStation = upsertResult[0];

    if (!upsertedStation || upsertResult.length !== 1) {
      throw new Error(
        `expected 1 station to be upserted, but got ${upsertResult.length}`,
      );
    }

    return upsertedStation;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
