import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { upsertRestaurant } from "./services";

describe("upsertRestaurant", () => {
  apiTest("inserts a new restaurant", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const fetchedRestaurant = await upsertRestaurant(
          trx,
          testData.restaurant,
        );
        expect(fetchedRestaurant.id).toEqual(testData.restaurant.id);
        expect(fetchedRestaurant.name).toEqual(testData.restaurant.name);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest(
    "updates an existing restaurant",
    async ({ expect, db, testData }) => {
      await expect(
        db.transaction(async (trx) => {
          const insertedRestaurant = await upsertRestaurant(
            trx,
            testData.restaurant,
          );
          const updatedRestaurant = await upsertRestaurant(
            trx,
            testData.restaurant,
          );
          expect(insertedRestaurant.updatedAt).not.toEqual(
            updatedRestaurant.updatedAt,
          );
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback");
    },
  );
});
