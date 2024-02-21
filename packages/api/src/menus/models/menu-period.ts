import { parseISO } from "date-fns";

import type { PrismaClient } from "@zotmeal/db";

import type { MenuPeriodParams } from "./menu";

export async function createMenuPeriod(
  db: PrismaClient,
  params: MenuPeriodParams,
) {
  const { id, name, start, end } = params;

  const startDate = parseISO(start);
  const endDate = parseISO(end);

  await db.menuPeriod.create({
    data: { id, name, start: startDate, end: endDate },
  });
}

export async function updateMenuPeriod(
  db: PrismaClient,
  params: MenuPeriodParams,
) {
  const { id, name, start, end } = params;

  const startDate = parseISO(start);
  const endDate = parseISO(end);

  await db.menuPeriod.update({
    where: { id },
    data: { id, name, start: startDate, end: endDate },
  });
}
