// import fs from "fs";
// import path from "path";
import { afterAll, describe, expect, it } from "vitest";
import { upsertEvents, getHTML, scrapeEvents } from "../services";
import { db } from "@zotmeal/drizzle-db";

describe("insert menu into db", () => {
  // refactor this to only test the insertion
  // test the scrape separately from the insertion

  // beforeAll(() => {
  //   db = new PrismaClient();
  // });

  it("scrapes events data and upserts it to db", async () => {
    // const filepath = path.join(__dirname, "../testdata/events.html");
    const html = await getHTML("https://uci.campusdish.com/api/events");
    if (!html) {
      throw new Error("html is null");
    }
    const events = await scrapeEvents(html);
    console.log("events:", events);
    expect(events).not.toBe(null);

    // batch upsert and rollback. should pass if 'Rollback' is the thrown error
    await expect(async () => {
      await db.transaction(async (trx) => {
        const upsertedEvents = await upsertEvents(trx, events!);
        if (!upsertedEvents) {
          throw new Error("upsertedEvents is null");
        }

        console.log("upsertedEvents:", upsertedEvents);

        trx.rollback();
      });
    }).rejects.toThrowError('Rollback');
  });

  // it("", () => {
  //   // add an integration test, ideally using testcontainers
  // });

  afterAll(async () => {
    // await db.$disconnect();
  });
});
