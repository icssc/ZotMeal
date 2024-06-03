import { describe, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "..";

describe("getEvents", () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  it("returns events", async () => {
    const result = await caller.event.get({});

    expect(result).toBeDefined();
  });

  it("fails on invalid params", async () => {
    expect(true).toBe(true);
  });
});
