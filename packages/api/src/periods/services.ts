import { upsert } from "@api/utils";

import type { Drizzle, Period } from "@zotmeal/db";
import { periods } from "@zotmeal/db";

export const upsertPeriod = async (db: Drizzle, period: Period) =>
  await upsert(db, periods, period, {
    target: periods.id,
    set: period,
  });
