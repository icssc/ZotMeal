import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { upsertDish } from "./services";

describe("upsertDish", () => {
  apiTest("inserts a dish", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const result = await upsertDish(trx, testData.dish);
        expect(result.id).toEqual(testData.dish.id);
        expect(result.dietRestriction).toBeDefined();
        expect(result.nutritionInfo).toBeDefined();
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest("updates a dish", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const insertResult = await upsertDish(trx, testData.dish);
        const updateResult = await upsertDish(trx, {
          ...testData.dish,
          name: "New dish name",
        });
        expect(updateResult.updatedAt).not.toEqual(insertResult.updatedAt);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});
