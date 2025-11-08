// Deprecated.
// Get list of events from GraphQL Endpoint AEM_EventList()

// import { apiTest } from "@api/apiTest";
// import { upsertEvents } from "@api/events/services";
// import { describe } from "vitest";

// import { getHTML, scrapeEvents } from ".";

// describe("scrapeEvents", () => {
//   apiTest(
//     "scrapes events data and inserts into db",
//     async ({ expect, db }) => {
//       await expect(
//         db.transaction(async (trx) => {
//           const html = await getHTML(
//             "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
//           );
//           const events = await scrapeEvents(html);
//           expect(events).toBeTruthy();

//           await expect(upsertEvents(trx, events)).resolves.toBeDefined();
//           trx.rollback();
//         }),
//       ).rejects.toThrowError("Rollback");
//     },
//     30_000,
//   );
// }, 30_000);
