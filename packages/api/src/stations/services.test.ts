import { describe, expect, it } from "vitest";

import type { Menu, Restaurant } from "@zotmeal/db";
import { createDrizzle } from "@zotmeal/db";

import { upsertMenu } from "../menus/services";
import { upsertRestaurant } from "../restaurants/services";
import { upsertStation } from "./services";
import { testData, updateData } from "./testData";

describe("upsertStation", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });

  const testRestaurant: Restaurant = {
    id: "3314",
    name: "brandywine",
  };

  // end should be 4 hours after start
  const testMenu: Menu = {
    date: "04/07/2024",
    id: "menu123",
    restaurantId: "3314",
    period: "dinner",
    start: new Date(),
    end: new Date(new Date().getTime() + 4 * 60 * 60 * 1000),
    price: "20.04",
  };

  it("inserts a new station", async () => {
    // crate a connection to the postgres

    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertRestaurant(trx, testRestaurant);
        await upsertMenu(trx, testMenu);

        const result = await upsertStation(trx, testData);
        expect(result.id).toEqual(testData.id);
        expect(result.name).toEqual(testData.name);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updates a station", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertRestaurant(trx, testRestaurant);
        await upsertMenu(trx, testMenu);

        await upsertStation(trx, testData);
        const result = await upsertStation(trx, updateData);
        expect(result.name).not.toEqual(testData.name);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
