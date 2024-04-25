import { describe, expect, it } from "vitest";
import type { GetMenuParams } from "..";
import { GetMenuSchema } from "..";
import { createCaller, createTRPCContext } from "../..";
import { TRPCError } from "@trpc/server";

describe("getMenu", () => {
  it("hello", () => {
    console.log("hello");
  });
});

describe("GetMenuSchema validates properly", () => {
  it("parses valid params", () => {
    const tests: GetMenuParams[] = [
      {
        date: "10/10/2024",
        periodName: "breakfast",
        restaurantName: "brandywine",
      },
    ];

    for (const test of tests) {
      const result = GetMenuSchema.safeParse(test);
      expect(result.success).toBe(true);
    }
  });

  it("fails on invalid params", () => {
    const tests: GetMenuParams[] = [
      {
        date: "10-10-2024",
        periodName: "breakfast",
        restaurantName: "brandywine",
      },
    ];

    for (const test of tests) {
      const result = GetMenuSchema.safeParse(test);
      expect(result.success).toEqual(false);
    }
  });
});

describe("menu.get", () => {
  // this test will not pass because the database is empty
  const ctx = createTRPCContext({});
  const caller = createCaller(ctx);

  // it("should get today's brandywine lunch menu", async () => {
  //   const menu = caller.menu.get({
  //     date: "1/24/2024",
  //     periodName: "breakfast",
  //     restaurantName: "brandywine",
  //   })
  //   await expect(menu).resolves.toBeTruthy();
  //   console.log("menu:", await menu); // should have a more robust test
  // });

  // TODO: finish implementing this once the database is populated.
  // each error should have a different message
  it("should not get an invalid menu", async () => {
    // invalid date (these tests fails)
    /*
    const invalidDate = caller.menu.get({
      date: "1/24/1984",
      periodName: "breakfast",
      restaurantName: "brandywine",
    })
    await expect(invalidDate).rejects.toThrowError(TRPCError);

    // invalid period
    const invalidPeriod = caller.menu.get({
      date: "1/24/2024",
      periodName: "latelatenight" as "latenight",
      restaurantName: "brandywine",
    })
    await expect(invalidPeriod).rejects.toThrowError(TRPCError);
    */

    // invalid restaurant
    const invalidRestaurant = caller.menu.get({
      date: "1/24/2024",
      periodName: "breakfast",
      restaurantName: "antwine" as "anteatery",
    })
    await expect(invalidRestaurant).rejects.toThrowError(TRPCError);
  });
});
