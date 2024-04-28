import { format, isToday } from "date-fns";
import { describe, expect, it } from "vitest";

import { PeriodEnum } from "@zotmeal/db";

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

describe("getSchedule", () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const date = format(new Date(), "MM/d/yyyy");

  it("should get today's brandywine schedule", async () => {
    const schedule = await caller.schedule.get({
      date,
      restaurantName: "brandywine",
    });
    expect(schedule).toBeTruthy();
    PeriodEnum.enumValues.forEach((period) => {
      const fetchedPeriod = schedule[period];

      if (!fetchedPeriod) {
        return;
      }

      expect(isToday(fetchedPeriod.start)).toBeTruthy();
    });
  });
});
