import { PrismaClient } from "@zotmeal/db";
import { afterAll, describe, expect, it } from "vitest";
import type { GetMenuParams } from "../router/menu/get";
import { insertMenu } from "./insert";

describe("insert menu into db", () => {
  const db = new PrismaClient();

  it("inserts menu into db, returns JSON of data inserted, and deletes inserted data afterwards", async () => {
    let errorOccurred = false;

    const params: GetMenuParams = {
      date: "02/09/2024",
      period: "lunch",
      restaurant: "brandywine"
    };

    try {
      await db.$transaction(async (trx) => {
        const insertedMenu = await insertMenu(trx, params);

        if (!insertedMenu) {
          throw new Error("insertedMenu is null");
        }

        console.log("insertedMenu:", insertedMenu);

        // Rollback the transaction to undo the insert
        throw new Error("rollback");
      });
    } catch (e) {
      if (e instanceof Error && e.message !== 'rollback') {
        console.error(e);
        errorOccurred = true;
      }
    }

    expect(errorOccurred).toBe(false);
  }, 10_000);

  // it("", () => {
  //   // add an integration test, ideally using testcontainers
  // });

  afterAll(async () => {
    await db.$disconnect();
  });
});
