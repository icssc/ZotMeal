import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { upsertRestaurant } from "../restaurants/services";
import { upsertMenu } from "./services";

describe("menu", () => apiTest("hello", () => console.log("hello")));

describe("upsertMenu()", () => {
  apiTest("inserts valid menu into db", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const restaurant = await upsertRestaurant(trx, testData.restaurant);
        expect(restaurant).toBeDefined();
        const upsertedMenu = await upsertMenu(trx, testData.menu);
        expect(upsertedMenu).toBeDefined();
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
  apiTest("updates existing menu in db", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const restaurant = await upsertRestaurant(trx, testData.restaurant);
        expect(restaurant).toBeDefined();

        const insertedMenu = await upsertMenu(trx, testData.menu);
        const updatedMenu = await upsertMenu(trx, {
          ...testData.menu,
          price: "20.05",
        });
        expect(updatedMenu).not.toEqual(insertedMenu);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});
