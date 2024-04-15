import { afterAll, describe, expect, it } from "vitest";

import { CampusDishResponseSchema } from "@zotmeal/validators";

import type { Menu } from "@zotmeal/db/src/schema";
import campus_dish_response from "./campus_dish_response.json";
import { upsertMenu } from "./menu";

import { parseCampusDish, getCampusDish } from './parse';
import { db } from "@zotmeal/db";
import { upsertPeriod, upsertRestaurant } from "../..";

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
        periodId: "99",
      },
      {
        id: "2",
        restaurantId: "9999",
        date: "02/20/2024",
        periodId: "99",
      },
      {
        id: "3",
        restaurantId: "9999",
        date: "03/29/2024",
        periodId: "99",
      }
    ];

    const testRestaurant = await upsertRestaurant(db, {
      id: "9999",
      name: "brandywine",
    });

    const testPeriod = await upsertPeriod(db, {
      id: "99",
      name: "lunch",
      start: "2024-01-17 15:15:00Z",
      end: "2024-01-17 16:15:00Z",
    });

    expect(testRestaurant).toBeTruthy();
    expect(testPeriod).toBeTruthy();

    for (const testMenu of testMenus) {
      await expect(async () => {
        await db.transaction(async (trx) => {
          const menu = await upsertMenu(trx, testMenu);
          expect(menu).toBeTruthy();
          console.log("upsertedMenu:", menu);

          trx.rollback();
        });
      }).rejects.toThrowError('Rollback');
    }
  });
  it("updates existing menu in db", async () => {
    const testMenus: Menu[] = [
      {
        id: "1",
        restaurantId: "9999",
        date: "01/17/2024",
        periodId: "99",
      },
      { // second menu with same id but different date
        id: "1",
        restaurantId: "9999",
        date: "04/30/2024",
        periodId: "99",
      }
    ];

    const testRestaurant = await upsertRestaurant(db, {
      id: "9999",
      name: "brandywine",
    });

    const testPeriod = await upsertPeriod(db, {
      id: "99",
      name: "lunch",
      start: "2024-01-17 15:15:00Z",
      end: "2024-01-17 16:15:00Z",
    });
    const testPeriod2 = await upsertPeriod(db, {
      id: "99",
      name: "lunch",
      start: "2024-01-17 15:15:00Z",
      end: "2024-01-17 16:15:00Z",
    });

    expect(testRestaurant).toBeTruthy();
    expect(testPeriod).toBeTruthy();
    expect(testPeriod2).toBeTruthy();

    // upsert dummy restaurant & period & menu. then rollback. should pass if 'Rollback' is the thrown error for each test
    for (const testMenu of testMenus) {
      await expect(async () => {
        await db.transaction(async (trx) => {
          const menu = await upsertMenu(trx, testMenu);
          expect(menu).toBeTruthy();
          console.log("upsertedMenu:", menu);

          trx.rollback();
        });
      }).rejects.toThrowError('Rollback');
    }
  });

  afterAll(async () => {
    // await db.$disconnect();
  });
});

describe("parseCampusDish()", () => {
  it("parses and upserts today's menu", async () => {
    const testParams = {
      date: "04/11/2024",
      restaurant: "brandywine",
      period: "lunch",
    };

    const campus_dish_response = await getCampusDish(testParams);

    if (!campus_dish_response) {
      console.error("Couldn't retreive campusDish menu", testParams);
    }
    else {
      await expect(async () => {
        await db.transaction(async (trx) => {
          await parseCampusDish(db, campus_dish_response)
          
          trx.rollback();
        });
      }).rejects.toThrowError('Rollback');
    }
  });
});
