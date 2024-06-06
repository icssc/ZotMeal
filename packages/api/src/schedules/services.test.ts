import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { getSchedule } from "./services";

// TODO: add more test cases
describe("test", () => {
  apiTest(
    "given date and restaurantName return the schedule of the date",
    async ({ expect, db }) => {
      await expect(
        db.transaction(async (trx) => {
          const schedule = await getSchedule(
            trx,
            new Date("2022-01-01"),
            "brandywine",
          );
          expect(schedule).toBeDefined();
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback");
    },
  );

  apiTest(
    "given date and restaurantName return '{}' if schedule not found",
    async ({ expect, db }) => {
      await expect(
        db.transaction(async (trx) => {
          await expect(
            getSchedule(trx, new Date("2022-01-05"), "invalid" as "brandywine"),
          ).resolves.toEqual({});
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback");
    },
  );
});
