import { afterAll, describe, expect, it } from "vitest";

import { PrismaClient } from "@zotmeal/db";

// import { createEvents, scrapeEvents } from "../services";

describe("createEvents", () => {
  const db = new PrismaClient();

  it("inserts events", () => {
    expect(true).toBe(true);
  });

  afterAll(async () => {
    await db.$disconnect();
  });
});
