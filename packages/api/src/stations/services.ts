import { upsert } from "@api/utils";

import type { Drizzle, InsertStation } from "@zotmeal/db";
import { stations } from "@zotmeal/db";

export const upsertStation = async (db: Drizzle, station: InsertStation) =>
  await upsert(db, stations, station, {
    target: stations.id,
    set: station,
  });
