import { afterAll, describe, expect, it } from "vitest";

import type { Menu } from "@zotmeal/db/src/schema";
import { createDrizzle } from "@zotmeal/db";
// import { parseCampusDish } from './parse';
import { CampusDishResponseSchema } from "@zotmeal/validators";

import { upsertRestaurant } from "../..";
import campus_dish_response from "./campus_dish_response.json";
import { upsertMenu } from "./menu";

const db = await createDrizzle("postgres://admin:admin@localhost:5433/zotmeal");
describe("parse campus dish", () => {
  it("parses valid campus dish response", () => {
    expect(() => {
      CampusDishResponseSchema.parse(campus_dish_response);
    }).not.toThrow;
  });

  it("fails on invalid campus dish response", () => {
    expect(() => {
      CampusDishResponseSchema.parse({});
    }).toThrow();
  });
});

describe("upsertMenu()", () => {
  it("inserts valid menu into db", async () => {
    // upsert dummy restaurant & period & menu -- then rollback. should pass if 'Rollback' is successfully thrown for each
    const testMenus: Menu[] = [
      {
        id: "1",
        restaurantId: "9999",
        date: "01/17/2024",
      },
      {
        id: "2",
        restaurantId: "9999",
        date: "02/20/2024",
      },
      {
        id: "3",
        restaurantId: "9999",
        date: "03/29/2024",
      },
    ];

    const testRestaurant = await upsertRestaurant(db, {
      id: "9999",
      name: "brandywine",
    });

    expect(testRestaurant).toBeTruthy();

    for (const testMenu of testMenus) {
      await expect(async () => {
        await db.transaction(async (trx) => {
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
      },
      {
        // second menu with same id but different date
        id: "1",
        restaurantId: "9999",
        date: "04/30/2024",
      },
    ];

    const testRestaurant = await upsertRestaurant(db, {
      id: "9999",
      name: "brandywine",
    });

    expect(testRestaurant).toBeTruthy();

    // upsert dummy restaurant & period & menu. then rollback. should pass if 'Rollback' is the thrown error for each test
    for (const testMenu of testMenus) {
      await expect(async () => {
        await db.transaction(async (trx) => {
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
