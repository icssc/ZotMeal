// import fs from "fs";
// import path from "path";
import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { getHTML, scrapeEvents, upsertEvents } from "../services";

describe("insert menu into db", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });

  it("scrapes events data and upserts it to db", async () => {
    // const filepath = path.join(__dirname, "../testdata/events.html");

    // batch upsert and rollback. should pass if 'Rollback' is the thrown error
    await expect(async () => {
      // flaky test
      const html = await getHTML(
        "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
      );
      const events = await scrapeEvents(html);
      expect(events).toBeTruthy();

      if (!events) {
        throw new Error("events is null");
      }

      await db.transaction(async (trx) => {
        const upsertedEvents = await upsertEvents(trx, events);
        if (!upsertedEvents) {
          throw new Error("upsertedEvents is null");
        }

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
}, 30_000);
