import { describe, expect, it } from "vitest";

import type { GetMenuParams } from "./get";
import { createCaller, createTRPCContext } from "../..";
import { GetMenuSchema } from "./get";

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
  // this test will not pass because the database is empty
  const ctx = createTRPCContext({});
  const caller = createCaller(ctx);

  it("should get today's brandywine lunch menu", () => {
    expect(async () => {
      const menu = await caller.menu.get({
        date: "1/24/2024",
        period: "breakfast",
        restaurant: "brandywine",
      });

      console.log(menu); // should have a more robust test
    }).not.toThrow();
  });

  it("should not get an invalid menu", () => {
    // expect a trpc code with a 404 error
    // out of date
    console.log("implement this test");

    // invalid period

    // invalid restaurant
  });
});
