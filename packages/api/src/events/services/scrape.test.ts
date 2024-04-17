// import fs from "fs";
// import path from "path";
import { afterAll, describe, expect, it } from "vitest";

import { createDrizzle } from "@zotmeal/db";

import { getHTML, scrapeEvents, upsertEvents } from "../services";

describe("insert menu into db", async () => {
  const db = await createDrizzle(
    "postgres://admin:admin@localhost:5434/zotmeal",
  );

  it("scrapes events data and upserts it to db", async () => {
    // const filepath = path.join(__dirname, "../testdata/events.html");
    const html = await getHTML("https://uci.campusdish.com/api/events");
    expect(html).toBeTruthy();
    const events = await scrapeEvents(html!);
    console.log("events:", events);
    expect(events).toBeTruthy();

    // batch upsert and rollback. should pass if 'Rollback' is the thrown error
    await expect(async () => {
      await db.transaction(async (trx) => {
        const upsertedEvents = await upsertEvents(trx, events!);
        console.log("upsertedEvents:", upsertedEvents);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
