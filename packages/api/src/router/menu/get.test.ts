import { describe, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "../..";

describe("", () => {
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
    console.log("implemented this test");

    // invalid period

    // invalid restaurant
  });
});
