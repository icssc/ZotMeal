import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { testData, updateData } from "../testdata/restaurantData";
import { upsertRestaurant } from "./restaurant";

describe("upsertRestaurant correctly", async () => {
  const db = await createDrizzle(process.env.DB_URL!);
  it("insertRestaurant", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        const result = await upsertRestaurant(trx, testData);
        expect(result).toEqual(testData);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updateRestaurant", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData);
        const result = await upsertRestaurant(trx, updateData);
        expect(result).toEqual(updateData);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
