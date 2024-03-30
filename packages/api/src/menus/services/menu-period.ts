import type { Drizzle } from "@zotmeal/drizzle-db";
import { menuPeriod } from "@zotmeal/drizzle-db/src/schema";
import type { MenuPeriod } from "@zotmeal/drizzle-db/src/schema";

export async function upsertPeriod(
  db: Drizzle,
  params: MenuPeriod,
): Promise<MenuPeriod | undefined> {
  try {
    const upsertedPeriod = await db
      .insert(menuPeriod)
      .values(params)
      .onConflictDoUpdate({
        target: menuPeriod.id,
        set: params,
      })
      .returning();

    if (upsertedPeriod.length !== 1) {
      throw new Error(`expected 1 period to be upserted, but got ${upsertedPeriod.length}`);
    }

    return upsertedPeriod[0];
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
