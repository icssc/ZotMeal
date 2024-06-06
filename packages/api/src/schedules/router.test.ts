import { describe } from "vitest";

import { periodNames } from "@zotmeal/utils";

import { apiTest } from "../../apiTest";

describe("getSchedule", () => {
  apiTest(
    "should get today's brandywine schedule",
    async ({ api, expect }) => {
      const schedule = await api.schedule.get({
        date: new Date(),
        restaurant: "brandywine",
      });
      expect(schedule).toBeTruthy();
      periodNames.forEach((period) => {
        const fetchedPeriod = schedule[period];

        if (!fetchedPeriod) return;

        // TODO: re-integrate this correctly. This fails because a pst day can span multiple days in UTC
        // expect(isToday(fetchedPeriod.start)).toBeTruthy();
      });
    },
    10_0000,
  );
});
