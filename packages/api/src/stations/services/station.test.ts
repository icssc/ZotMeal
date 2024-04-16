import { describe, expect, it } from "vitest";

import type { Menu } from "@zotmeal/db";
import { createDrizzle } from "@zotmeal/db";

import { upsertMenu } from "../../menus";
import { testData, updateData } from "../testdata/stationData";
import { upsertStation } from "./station";

describe("upsertStation correctly", async () => {
  const db = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );

  const testMenu: Menu = {
    date: "04/07/2024",
    id: "menu123",
    restaurantId: "9999",
    period: "dinner",
    start: "04/07/2024",
    end: "04/07/2024",
    price: "20.04",
  };
  it("insertStation", async () => {
    // crate a connection to the postgres

    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertMenu(trx, testMenu);
        const result = await upsertStation(trx, testData);
        expect(result).toEqual(testData);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updateStation", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertMenu(trx, testMenu);
        await upsertStation(trx, testData);
        const result = await upsertStation(trx, updateData);
        expect(result).toEqual(updateData);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});