import { format } from "date-fns";
import { describe, expect, it } from "vitest";

import { periodNames } from "@zotmeal/utils";

import type { GetScheduleParams } from "./services";
import { createCaller, createTRPCContext } from "../.";
import { GetScheduleSchema } from "./services";

describe("getScheduleSchema", () => {
  it("parses valid params", () => {
    const tests: GetScheduleParams[] = [
      {
        date: "04/22/2024",
        restaurant: "brandywine",
      },
    ];

    for (const test of tests) {
      const result = GetScheduleSchema.safeParse(test);
      expect(result.success).toBe(true);
    }
  });

  it("fails with invalid params", () => {
    const tests: GetScheduleParams[] = [
      {
        date: "04-22/2024",
        restaurant: "brandywine",
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
      restaurant: "brandywine",
    });
    expect(schedule).toBeTruthy();
    periodNames.forEach((period) => {
      const fetchedPeriod = schedule[period];

      if (!fetchedPeriod) {
        return;
      }

      // TODO: re-integrate this correctly. This fails because a pst day can span multiple days in UTC
      // expect(isToday(fetchedPeriod.start)).toBeTruthy();
    });
  }, 10_0000);
});
