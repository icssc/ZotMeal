// import fs from "fs";
// import path from "path";
import { describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { getHTML, scrapeEvents, upsertEvents } from "../services";

describe("insert menu into db", async () => {
  const db = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );

  it("scrapes events data and upserts it to db", async () => {
    // const filepath = path.join(__dirname, "../testdata/events.html");

    // batch upsert and rollback. should pass if 'Rollback' is the thrown error
    await expect(async () => {
      // flaky test
      const html = await getHTML(
        "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
      );
      // console.log(html);
      const events = await scrapeEvents(html);
      console.log("events:", events);
      expect(events).toBeTruthy();
      await db.transaction(async (trx) => {
        const upsertedEvents = await upsertEvents(trx, events!);
        if (!upsertedEvents) {
          throw new Error("upsertedEvents is null");
        }

        console.log("upsertedEvents:", upsertedEvents);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
},
{
  timeout: 10000,
}
);
