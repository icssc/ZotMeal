import { TRPCError } from "@trpc/server";
import { format, isToday, parseISO } from "date-fns";
import { describe, expect, it } from "vitest";

import { getRestaurantId } from "@zotmeal/utils";

import type { GetMenuParams } from "./getMenu";
import { createCaller, createTRPCContext } from "../..";
import { GetMenuSchema } from "./getMenu";

describe("getMenu", () => it("hello", () => console.log("hello")));

describe("GetMenuSchema validates properly", () => {
  it("parses valid params", () => {
    const tests: GetMenuParams[] = [
      {
        date: "10/10/2024",
        period: "breakfast",
        restaurant: "brandywine",
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
        period: "breakfast",
        restaurant: "brandywine",
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
      period: "lunch",
      restaurant: "brandywine",
    });
    expect(menu).toBeTruthy();
    expect(isToday(parseISO(menu.date))).toBeTruthy();
    expect(menu.restaurantId).toEqual(getRestaurantId("brandywine"));
  }, 10_000);

  // TODO: have each invalid input give unique TRPCError message
  it("should not get an invalid menu", async () => {
    const invalidDate = caller.menu.get({
      date: "4-24-2024",
      period: "lunch",
      restaurant: "brandywine",
    });
    await expect(invalidDate).rejects.toThrowError(TRPCError);

    const invalidPeriod = caller.menu.get({
      date,
      period: "latelatenight" as "latenight",
      restaurant: "brandywine",
    });
    await expect(invalidPeriod).rejects.toThrowError(TRPCError);

    const invalidRestaurant = caller.menu.get({
      date,
      period: "lunch",
      restaurant: "antwine" as "anteatery",
    });

    await expect(invalidRestaurant).rejects.toThrowError(TRPCError);
  });
}, 10_000);
