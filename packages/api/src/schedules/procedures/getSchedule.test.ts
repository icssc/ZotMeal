import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import type { GetScheduleParams } from "../services/schedule";
import { createCaller, createTRPCContext } from "../..";
import { GetScheduleSchema } from "../services/schedule";

describe("getScheduleSchema validates properly", () => {
  it("sucess when parse valid params", () => {
    const tests: GetScheduleParams[] = [
      {
        date: "04/22/2024",
        restaurantName: "brandywine",
      },
    ];

    for (const test of tests) {
      const result = GetScheduleSchema.safeParse(test);
      expect(result.success).toBe(true);
    }
  });

  it("fail when parse invalid params", () => {
    const tests: GetScheduleParams[] = [
      {
        date: "04-22/2024",
        restaurantName: "brandywine",
      },
    ];

    for (const test of tests) {
      const result = GetScheduleSchema.safeParse(test);
      expect(result.success).toBe(false);
    }
  });
});

describe("getSchedule", async () => {
  const { db } = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );
  const ctx = createTRPCContext({ db });
  const caller = createCaller(ctx);

  it("should get schedule", async () => {
    const schedule = await caller.schedule.get({
      date: "04/22/2024",
      restaurantName: "brandywine",
    });

    expect(schedule).toBeTruthy();
  });
});
