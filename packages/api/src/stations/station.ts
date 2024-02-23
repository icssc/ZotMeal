import type {
  PrismaClientWithAccelerate,
  TransactionClientWithAccelerate,
} from "@zotmeal/db";

import type { StationParams } from "./models";

export async function saveStation(
  db: PrismaClientWithAccelerate | TransactionClientWithAccelerate,
  params: StationParams,
) {
  const { id, name, restaurantId } = params;

  const station = await db.station.upsert({
    where: { id },
    create: {
      id,
      name,
      restaurantId,
    },
    update: {
      id,
      name,
      restaurantId,
    },
  });
  return station;
}
