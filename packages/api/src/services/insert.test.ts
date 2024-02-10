import { PrismaClient } from "@zotmeal/db";
import { describe, expect, it } from "vitest";
import { insertMenu } from "./insert";
import type { GetMenuParams } from "../router/menu/get";

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
      const insertedMenu = await insertMenu(db, params);

      if (!insertedMenu) {
        throw new Error("insertedMenu is null");
      }

      console.log("insertedMenu:", insertedMenu);

      // clean up
      await db.station.deleteMany({
        where: {
          menuId: insertedMenu.id,
        },
      });
      await db.menu.delete({
        where: {
          id: insertedMenu.id,
        },
      });
    } catch (e) {
      console.error(e);
      errorOccurred = true;
    }

    expect(errorOccurred).toBe(false);
  }, 10_000);

  // it("", () => {
  //   // add an integration test, ideally using testcontainers
  // });
});
