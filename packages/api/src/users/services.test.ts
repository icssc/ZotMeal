import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { getUser, upsertUser } from "./services";

const userId = "1";

const user = {
  id: userId,
  name: "John Doe",
};

const updatedUser = {
  id: userId,
  name: "Jane Doe",
};

describe("upsertUser", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("inserts valid user into db", async () => {
    const upsertedUser = await upsertUser(db, user);
    expect(upsertedUser).toBeDefined();
    expect(upsertedUser?.id).toBe(userId);
  });

  //
  it("updates existing user in db", async () => {
    const upsertedUser = await upsertUser(db, updatedUser);
    expect(upsertedUser).toBeDefined();
    expect(upsertedUser?.id).toBe(userId);
    expect(upsertedUser?.name).toBe("Jane Doe");
  });
});

describe("getUser", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("gets user by id", async () => {
    await upsertUser(db, user);
    const fetchedUser = await getUser(db, { userId });
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser?.userId).toBe("1");
  });

  it("should return null if user not found", async () => {
    const user = await getUser(db, { userId: "2" });
    expect(user).toBeNull();
  });
});
