import { apiTest } from "@api/apiTest";
import { upsertPeriod } from "@api/periods/services";
import { upsertRestaurant } from "@api/restaurants/services";
import { describe } from "vitest";

import { upsertMenu } from "./services";

describe("upsertMenu", () => {
  apiTest("inserts valid menu into db", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        await upsertPeriod(trx, testData.period);
        await upsertMenu(trx, testData.menu);

        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
  apiTest("updates existing menu in db", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        await upsertPeriod(trx, testData.period);
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
