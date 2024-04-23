import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { getSchedule, GetScheduleParams } from "./schedule";

describe("test", async () => {
  const { db } = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );
  it("given date and restaurantName return the schedule of the date", async () => {
    const testParams: GetScheduleParams[] = [
      {
        date: "04/22/2024",
        restaurantName: "brandywine",
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
