import { upsert } from "@api/utils";

import type { Drizzle, Station } from "@zotmeal/db";
import { stations } from "@zotmeal/db";

export const upsertStation = async (db: Drizzle, station: Station) =>
  await upsert(db, stations, station, {
    target: stations.id,
    set: station,
  });
