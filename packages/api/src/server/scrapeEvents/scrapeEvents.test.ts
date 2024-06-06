import { describe } from "vitest";

import { getHTML, scrapeEvents } from ".";
import { apiTest } from "../../../apiTest";
import { upsertEvents } from "../../events/services";

describe("scrapeEvents", () => {
  apiTest(
    "scrapes events data and inserts into db",
    async ({ expect, db }) => {
      await expect(
        db.transaction(async (trx) => {
          const html = await getHTML(
            "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
          );
          const events = await scrapeEvents(html);
          expect(events).toBeTruthy();

          await expect(upsertEvents(trx, events!)).resolves.toBeDefined();
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback");
    },
    30_000,
  );
}, 30_000);
