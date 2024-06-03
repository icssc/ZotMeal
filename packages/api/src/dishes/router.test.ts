import { describe, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "..";

describe("getRatingProcedure", () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  it("returns a rating", async () => {
    const result = await caller.dish.getRating({
      dishId: "1",
    });

    expect(result).toEqual(1);
  });

  it("fails on invalid params", async () => {
    await expect(
      async () =>
        await caller.dish.getRating({
          dishId: 1 as unknown as "1",
        }),
    ).rejects.toThrow();
  });
});

describe("rateDishProcedure", () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  it("returns a rating", async () => {
    const result = await caller.dish.rate({
      dishId: "1",
      userId: "1",
      rating: 1,
    });

    expect(result).toEqual(1);
  });

  it("fails on invalid params", async () => {
    await expect(
      async () =>
        await caller.dish.rate({
          dishId: 1 as unknown as "1",
          userId: "1",
          rating: 1,
        }),
    ).rejects.toThrow();
  });
});
