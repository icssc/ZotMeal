import { z } from "zod";

import type { Prisma, PrismaClient } from "@zotmeal/db";
import { parseCampusDish } from "..";
import { CampusDishResponse, CampusDishResponseSchema } from "@zotmeal/validators";

export const BatchInsertSchema = z.object({
  menus: z.array(CampusDishResponseSchema)
});

export type BatchInsertParams = z.infer<typeof BatchInsertSchema>;

export async function batchInsert(
  db: PrismaClient | Prisma.TransactionClient,
  menus: CampusDishResponse[]
): Promise<void> {
  for (const menu of menus) {
    parseCampusDish(db, menu);
  }
}