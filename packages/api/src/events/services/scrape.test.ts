import fs from "fs";
import path from "path";
import { afterAll, describe, expect, it } from "vitest";

import { PrismaClient } from "@zotmeal/db";

import { createEvents, scrapeEvents } from "../services";

const db = new PrismaClient();

describe("insert menu into db", () => {
  // refactor this to only test the insertion
  // test the scrape separately from the insertion

  // beforeAll(() => {
  //   db = new PrismaClient();
  // });

  it("scrapes events data and inserts it into the db", () => {
    const filepath = path.join(__dirname, "../testdata/events.html");
    const html = fs.readFileSync(filepath, "utf8");
    const events = scrapeEvents(html);
    expect(events).not.toBe(null);

    expect(async () => {
      await db.$transaction(async (trx) => {
        const insertedEvents = await createEvents(trx, events!);
        if (!insertedEvents) {
          throw new Error("insertedEvents is null");
        }

        console.log("insertedEvents:", insertedEvents);

        // Rollback the transaction to undo the insert
        throw new Error("rollback");
      });
    }).not.toThrow();
  });

  // it("", () => {
  //   // add an integration test, ideally using testcontainers
  // });

  // afterAll(async () => {
  //   await db.$disconnect();
  // });
});
