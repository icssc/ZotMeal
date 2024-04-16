import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { upsertMenu } from "../../menus";
import { testData, updateData } from "../testdata/stationData";
import { upsertStation } from "./station";

describe("upsertStation correctly", async () => {
  const db = await createDrizzle(
    "postgres://admin:admin@localhost:5433/zotmeal",
  );
  it("insertStation", async () => {
    // crate a connection to the postgres

    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertMenu(trx, {
          date: "04/07/2024",
          id: "menu123",
          restaurantId: "9999",
          createdAt: "04/07/2024",
          updatedAt: "04/07/2024",
        });
        const result = await upsertStation(trx, testData);
        expect(result).toEqual(testData);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updateStation", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertMenu(trx, {
          date: "04/07/2024",
          id: "menu123",
          restaurantId: "9999",
          createdAt: "04/07/2024",
          updatedAt: "04/07/2024",
        });
        await upsertStation(trx, testData);
        const result = await upsertStation(trx, updateData);
        expect(result).toEqual(updateData);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
