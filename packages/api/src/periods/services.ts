import { upsert } from "@api/utils";

import type { Drizzle, InsertPeriod } from "@zotmeal/db";
import { periods } from "@zotmeal/db";

export const upsertPeriod = async (db: Drizzle, period: InsertPeriod) =>
  await upsert(db, periods, period, {
    target: [periods.id, periods.date],
    set: period,
  });
