import { describe, expect, it } from "vitest";

import type { Menu, Restaurant } from "@zotmeal/db";
import { createDrizzle } from "@zotmeal/db";

import { upsertRestaurant } from "../restaurants/services";
import { upsertMenu } from "./services";

const testMenu = {
  id: "1",
  restaurantId: "3056",
  date: "01/17/2024",
  period: "dinner",
  start: new Date(),
  end: new Date(),
  price: "20.04",
} satisfies Menu;

const updatedTestMenu = {
  ...testMenu,
  date: "04/30/2024",
} satisfies Menu;

const testMenus = [testMenu, updatedTestMenu];

const testRestaurant: Restaurant = {
  id: "3056",
  name: "brandywine",
};

describe("menu", () => it("hello", () => console.log("hello")));

describe("upsertMenu()", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("inserts valid menu into db", async () => {
    // upsert dummy restaurant & period & menu -- then rollback. should pass if 'Rollback' is successfully thrown for each

    expect(testRestaurant).toBeTruthy();
    for (const menu of [testMenu]) {
      await expect(async () => {
        await db.transaction(async (trx) => {
          // Insert a test restaurant
          const restaurant = await upsertRestaurant(trx, testRestaurant);
          expect(restaurant).toBeTruthy();

          // Insert a test menu
          const upsertedMenu = await upsertMenu(trx, menu);
          expect(upsertedMenu).toBeTruthy();

          trx.rollback();
        });
      }).rejects.toThrowError("Rollback");
    }
  });
  it("updates existing menu in db", async () => {
    // upsert dummy restaurant & period & menu. then rollback. should pass if 'Rollback' is the thrown error for each test
    for (const testMenu of testMenus) {
      await expect(async () => {
        await db.transaction(async (trx) => {
          // Insert a test restaurant
          const restaurant = await upsertRestaurant(trx, testRestaurant);
          expect(restaurant).toBeTruthy();

          // Insert test menu
          const menu = await upsertMenu(trx, testMenu);
          expect(menu).toBeTruthy();

          trx.rollback();
        });
      }).rejects.toThrowError("Rollback");
    }
  });
});
