import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

import { daily } from ".";

describe("daily", () => {
  apiTest(
    "should populate db with daily menu",
    async ({ expect, db }) => {
      await expect(
        db.transaction(async (trx) => {
          await daily(trx, new Date(), "brandywine");
          const menus = await trx.query.menus.findMany();
          expect(menus.length).toBeGreaterThan(0);
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback");
    },
    { timeout: 60_000 },
  );
});
