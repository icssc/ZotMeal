import { describe, expect, it } from "vitest";

import { db } from "@zotmeal/db";

import { upsertMenu } from "../../menus";
import { upsertStation } from "../../stations";
import { testData, updateData } from "../testdata";
import { upsertDish } from "./dish";

describe("upsertDish correctly", () => {
  // First time is insert because no conflict id
  it("insertDish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertMenu(trx, {
          date: "04/07/2024",
          id: "menu456",
          restaurantId: "9999",
          periodId: "99",
          createdAt: "04/07/2024",
          updatedAt: "04/07/2024",
        });
        await upsertStation(trx, {
          id: "station45",
          name: "test-station",
          restaurantId: "9999",
          menuId: "menu456",
          createdAt: "04/07/2024",
          updatedAt: "04/07/2024",
        });
        const result = await upsertDish(trx, testData);
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
        await upsertMenu(trx, {
          date: "04/07/2024",
          id: "menu456",
          restaurantId: "9999",
          periodId: "99",
          createdAt: "04/07/2024",
          updatedAt: "04/07/2024",
        });
        await upsertStation(trx, {
          id: "station45",
          name: "test-station",
          restaurantId: "9999",
          menuId: "menu456",
          createdAt: "04/07/2024",
          updatedAt: "04/07/2024",
        });
        await upsertDish(trx, testData);
        const result = await upsertDish(trx, updateData);

        expect(result).toEqual({
          ...updateData,
          dietRestriction: updateData.dietRestriction,
          nutritionInfo: updateData.nutritionInfo,
        });

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
