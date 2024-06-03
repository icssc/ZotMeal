import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { upsertRestaurant } from "./services";
import { testData, updateData } from "./testData";

describe("upsertRestaurant", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("inserts a new restaurant", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        const result = await upsertRestaurant(trx, testData);
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updates an existing restaurant", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        const insertedRestaurant = await upsertRestaurant(trx, testData);
        const updatedRestaurant = await upsertRestaurant(trx, updateData);
        expect(insertedRestaurant.updatedAt).not.toEqual(
          updatedRestaurant.updatedAt,
        );
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
