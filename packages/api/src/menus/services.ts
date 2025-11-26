import { upsert, upsertBatch } from "@api/utils";

import { sql, min, max } from "drizzle-orm";
import type { DateRange, Drizzle, InsertMenu } from "@zotmeal/db";
import { menus } from "@zotmeal/db";

export const upsertMenu = async (db: Drizzle, menu: InsertMenu) =>
  await upsert(db, menus, menu, {
    target: menus.id,
    set: menu,
  });

export const upsertMenuBatch = async (db: Drizzle, menuBatch: InsertMenu[]) =>
  await upsertBatch(db, menus, menuBatch, {
    target: menus.id,
    set: {
      periodId: sql`excluded.period_id`,
      date: sql`excluded.date`,
      price: sql`excluded.price`,
    },
  });

/* 
 * Returns an object with the earliest
 * and latest dates present in the menus table.
*/
export async function getDateRange(db: Drizzle): Promise<DateRange | null> {
  const [res] = await db
    .select({
      earliest: min(menus.date),
      latest: max(menus.date)
    })
    .from(menus);
  
  if (!res?.earliest && !res?.latest)
    return null
  
  return {
    earliest: res?.earliest ? new Date(res.earliest) : null,
    latest: res?.latest ? new Date(res.latest) : null,
  }
}