import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { upsertDish } from "./services";
import { testData, updateData } from "./testData";

describe("upsertDish", () => {
  // First time is insert because no conflict id

  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("inserts a dish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        const result = await upsertDish(trx, testData);
        expect(result.id).toEqual(testData.id);
        expect(result.dietRestriction).toBeDefined();
        expect(result.nutritionInfo).toBeDefined();
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  //Second time update because conflict id
  it("updates a dish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertDish(trx, testData);
        const result = await upsertDish(trx, updateData);
        expect(result.id).toEqual(testData.id);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
