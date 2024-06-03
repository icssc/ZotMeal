import { describe, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "../.";

// TODO
describe("getUserSchema", () => {
  it("parses valid params", () => {
    expect(true).toBeTruthy();
  });

  it("fails on invalid params", () => {
    expect(true).toBeTruthy();
  });
});

// TODO
describe("upsertUserSchema", () => {
  it("parses valid params", () => {
    expect(true).toBeTruthy();
  });

  it("fails on invalid params", () => {
    expect(true).toBeTruthy();
  });
});

// TODO
describe("getUserProcedure", () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  it("gets a user", async () => {
    const user = await caller.user.get({ userId: "peter-anteater" });
    expect(user).toBeDefined();
  });

  it("should not get an invalid user", async () => {
    const user = await caller.user.get({ userId: "invalid" });
    expect(user).toBeUndefined();
  });
});

// TODO
describe("upsertUserProcedure", () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  it("inserts a user", async () => {
    const user = await caller.user.upsert({
      id: "peter-anteater",
      name: "Peter",
    });
    expect(user).toBeDefined();
  });

  it("updates a user", async () => {
    const user = await caller.user.upsert({
      id: "peter-anteater",
      name: "Beter",
    });
    expect(user).toBeDefined();
  });

  // Maybe not necessary
  it("should not upsert an invalid user", async () => {
    await expect(
      caller.user.upsert({ id: 1 as unknown as string, name: "Peter" }),
    ).rejects.toThrow();
  });
});
