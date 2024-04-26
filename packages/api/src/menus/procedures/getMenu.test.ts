import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { describe, expect, it } from "vitest";

import { getRestaurantId } from "@zotmeal/utils";

import type { GetMenuParams } from "..";
import { GetMenuSchema } from "..";
import { createCaller, createTRPCContext } from "../..";

describe("getMenu", () => it("hello", () => console.log("hello")));

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
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const date = format(new Date(), "MM/d/yyyy");

  it("should get today's brandywine lunch menu", async () => {
    const menu = await caller.menu.get({
      date,
      periodName: "lunch",
      restaurantName: "brandywine",
    });
    expect(menu).toBeTruthy();
    // expect(isToday(menu.date)).toBeTruthy(); // TODO: re-integrate once getMenu is fixed
    expect(menu.restaurantId).toEqual(getRestaurantId("brandywine"));
  });

  // TODO: have each invalid input give unique TRPCError message
  it("should not get an invalid menu", async () => {
    const invalidDate = caller.menu.get({
      date: "4-24-2024",
      periodName: "lunch",
      restaurantName: "brandywine",
    });
    await expect(invalidDate).rejects.toThrowError(TRPCError);

    const invalidPeriod = caller.menu.get({
      date,
      periodName: "latelatenight" as "latenight",
      restaurantName: "brandywine",
    });
    await expect(invalidPeriod).rejects.toThrowError(TRPCError);

    const invalidRestaurant = caller.menu.get({
      date,
      periodName: "lunch",
      restaurantName: "antwine" as "anteatery",
    });

    await expect(invalidRestaurant).rejects.toThrowError(TRPCError);
  });
});
