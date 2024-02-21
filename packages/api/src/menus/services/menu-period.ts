import { parseISO } from "date-fns";

import type { Prisma, PrismaClient } from "@zotmeal/db";

import type { MenuPeriodParams } from "../models/menu";

export async function savePeriod(
  db: PrismaClient | Prisma.TransactionClient,
  params: MenuPeriodParams,
) {
  const { id, start, end, name } = params;

  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const period = await db.menuPeriod.upsert({
    where: { id },
    create: { id, start: startDate, end: endDate, name },
    update: { start: startDate, end: endDate, name },
  });
  return period;
}
