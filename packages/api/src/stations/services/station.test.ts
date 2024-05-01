import { describe, expect, it } from "vitest";

import type { Menu, Restaurant } from "@zotmeal/db";
import { createDrizzle } from "@zotmeal/db";

import { upsertMenu } from "../../menus";
import { upsertRestaurant } from "../../restaurants";
import { testData, updateData } from "../testdata/stationData";
import { upsertStation } from "./station";

describe("upsertStation correctly", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });

  const testRestaurant: Restaurant = {
    id: "3314",
    name: "brandywine",
  };

  const testMenu: Menu = {
    date: "04/07/2024",
    id: "menu123",
    restaurantId: "3314",
    period: "dinner",
    start: "04/07/2024",
    end: "04/07/2024",
    price: "20.04",
  };
  it("insertStation", async () => {
    // crate a connection to the postgres

    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertRestaurant(trx, testRestaurant);
        await upsertMenu(trx, testMenu);

        const result = await upsertStation(trx, testData);
        expect(result).toEqual(testData);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updateStation", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertRestaurant(trx, testRestaurant);
        await upsertMenu(trx, testMenu);

        await upsertStation(trx, testData);
        const result = await upsertStation(trx, updateData);
        expect(result).toEqual(updateData);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
