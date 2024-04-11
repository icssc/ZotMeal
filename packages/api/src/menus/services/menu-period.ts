import type { Drizzle } from "@zotmeal/db";
import { menuPeriod } from "@zotmeal/db/src/schema";
import type { MenuPeriod } from "@zotmeal/db/src/schema";

export async function upsertPeriod(
  db: Drizzle,
  params: MenuPeriod,
): Promise<MenuPeriod | undefined> {
  try {
    const upsertedPeriod = await db
      .insert(menuPeriod)
      .values(params)
      .onConflictDoUpdate({
        target: menuPeriod.name,
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
