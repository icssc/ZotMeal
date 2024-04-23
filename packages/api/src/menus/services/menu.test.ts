import { afterAll, describe, expect, it } from "vitest";

import type { Menu, Restaurant } from "@zotmeal/db";
import { createDrizzle } from "@zotmeal/db";

import { upsertRestaurant } from "../../restaurants";
import { upsertMenu } from "./menu";

describe("menu", () => {
  it("hello", () => {
    console.log("hello");
  });
});
describe("upsertMenu()", async () => {
  const { db } = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );
  it("inserts valid menu into db", async () => {
    // upsert dummy restaurant & period & menu -- then rollback. should pass if 'Rollback' is successfully thrown for each
    const testMenus: Menu[] = [
      {
        id: "1",
        restaurantId: "9999",
        date: "01/17/2024",
        period: "dinner",
        start: "01/17/2024",
        end: "01/17/2024",
        price: "20.04",
      },
    ];

    const testRestaurant: Restaurant = {
      id: "9999",
      name: "brandywine_test",
    };

    expect(testRestaurant).toBeTruthy();
    console.log("BEFORE TEST");
    for (const testMenu of testMenus) {
      await expect(async () => {
        await db.transaction(async (trx) => {
          console.log("HI");
          // Insert a test restaurant
          const restaurant = await upsertRestaurant(trx, testRestaurant);
          console.log(restaurant);
          expect(restaurant).toBeTruthy();
          // Insert a test menu
          const menu = await upsertMenu(trx, testMenu);
          expect(menu).toBeTruthy();
          // console.log("upsertedMenu:", menu);

          trx.rollback();
        });
      }).rejects.toThrowError("Rollback");
    }
  });
  it("updates existing menu in db", async () => {
    const testMenus: Menu[] = [
      {
        id: "1",
        restaurantId: "9999",
        date: "01/17/2024",
        period: "dinner",
        start: "01/17/2024",
        end: "01/17/2024",
        price: "20.04",
      },
      {
        // second menu with same id but different date
        id: "1",
        restaurantId: "9999",
        date: "04/30/2024",
        period: "dinner",
        start: "01/17/2024",
        end: "01/17/2024",
        price: "20.04",
      },
    ];

    const testRestaurant: Restaurant = {
      id: "9999",
      name: "brandywine_test",
    };

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
          // console.log("upsertedMenu:", menu);

          trx.rollback();
        });
      }).rejects.toThrowError("Rollback");
    }
  });

  afterAll(async () => {
    // await db.$disconnect();
  });
});
