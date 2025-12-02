import { upsert, upsertBatch } from "@api/utils";
import type { Drizzle, InsertMenu } from "@peterplate/db";
import { menus } from "@peterplate/db";
import { sql } from "drizzle-orm";

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
