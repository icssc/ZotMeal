import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { testData, updateData } from "../testdata";
import { upsertDish } from "./dish";

describe("upsertDish correctly", async () => {
  // First time is insert because no conflict id

  const { db } = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );
  it("insertDish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        const result = await upsertDish(trx, testData);
        console.log(result);
        expect(result).toEqual({
          ...testData,
          dietRestriction: testData.dietRestriction,
          nutritionInfo: testData.nutritionInfo,
        });
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  //Second time update because conflict id
  it("updateDish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertDish(trx, testData);
        // await upsertDish(trx, testData);
        const result = await upsertDish(trx, updateData);
        console.log(result);
        expect(result.id).toEqual(testData.id);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
