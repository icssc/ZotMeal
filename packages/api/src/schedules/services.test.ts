import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import type { GetScheduleParams } from "./services";
import { getSchedule } from "./services";

describe("test", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("given date and restaurantName return the schedule of the date", async () => {
    const testParams: GetScheduleParams[] = [
      {
        date: "04/22/2024",
        restaurant: "brandywine",
      },
    ];
    for (const testParam of testParams) {
      await expect(async () => {
        await db.transaction(async (trx) => {
          const schedule = await getSchedule(trx, testParam);
          expect(schedule).toBeTruthy();
          trx.rollback();
        });
      }).rejects.toThrowError("Rollback");
    }
  });
});
