import { PrismaClient } from "@zotmeal/db";
import { afterAll, describe, expect, it } from "vitest";
import type { GetMenuParams } from "../router/menu/get";
import type { MenuModel } from "../models/menu";
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

    let insertedMenu: MenuModel | null = null;

    try {
      insertedMenu = await insertMenu(db, params);

      if (!insertedMenu) {
        throw new Error("insertedMenu is null");
      }

      console.log("insertedMenu:", insertedMenu);

    } catch (e) {
      console.error(e);
      errorOccurred = true;
    } finally {
      // clean up
      try {
        await db.$transaction(async (trx) => {
          if (!insertedMenu) {
            return;
          }
          await trx.station.deleteMany({
            where: {
              menuId: insertedMenu.id,
            },
          });
          await trx.menu.delete({
            where: {
              id: insertedMenu.id,
            },
          });
        });
      } catch (e) {
        console.error('Failed to clean up test data:', e);
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
