import { logger } from "@api/logger";
import axios from "axios";
import * as cheerio from "cheerio";
import { setYear } from "date-fns";

import type { Event } from "@zotmeal/db";
import { EventSchema, getRestaurantId } from "@zotmeal/db";

/**
 * @example
 * parseEventDate("APRIL 22 11:00 AM")
 * // output: new Date("APRIL 22, <current year> 11:00 AM")
 */
export const parseEventDate = (dateStr: string) =>
  setYear(new Date(dateStr), new Date().getFullYear());

export async function getHTML(url: string): Promise<string> {
  try {
    const res = await axios.get(url);
    if (typeof res.data !== "string")
      throw new Error("response data is not a string");
    return res.data;
  } catch (e) {
    console.error(`Error fetching from url: ${url}`, e);
    throw e;
  }
}

export async function scrapeEvents(html: string): Promise<Event[]> {
  try {
    logger.info(`scrapeEvents: Scraping events...`);
    const $ = cheerio.load(html);

    // iterate through each event item and extract data
    const events = await Promise.all(
      $("li").map(async (_, element) => {
        const eventItem = $(element);

        const title = eventItem.find(".gridItem_title_text").text();
        const imageSrc = eventItem.find("img").attr("src");

        const image = imageSrc ? `https://uci.campusdish.com${imageSrc}` : "";

        // do an inner fetch on the event's page for restaurant association
        const href = eventItem.find("a").attr("href");
        if (!href) throw new Error("unable to find event page link");
        logger.debug(href);
        const eventPageHtml = await getHTML(href);

        // skip if unable to fetch event page
        if (!eventPageHtml)
          throw new Error(`unable to fetch event page for event: ${title}`);

        const eventPage$ = cheerio.load(eventPageHtml);

        const longDescription = eventPage$(".col-xs-6").text();

        // e.g. APRIL 22 11:00 AM – APRIL 27 3:00 PM
        const eventDates = eventPage$(".dates").text().trim().split("–");
        const [start, end] = eventDates.map(parseEventDate);

        if (!start || !end)
          throw new Error(`invalid date format ${eventDates}`);

        // e.g. "LOCATION: THE ANTEATERY" or "LOCATION: BRANDYWINE"
        const location = eventPage$(".location").text().toLowerCase();

        if (!location.includes("anteatery") && !location.includes("brandywine"))
          throw new Error(
            `expected location to be brandywine or anteatery but got ${location}`,
          );

        const restaurant = location.includes("anteatery")
          ? "anteatery"
          : "brandywine";

        const shortDescription = eventItem
          .find(".gridItem__body")
          .first()
          .text()
          .trim();

        const event = EventSchema.parse({
          title,
          image,
          restaurantId: getRestaurantId(restaurant),
          shortDescription,
          longDescription,
          start,
          end,
        } satisfies Event);

        logger.debug(event);
        return event;
      }),
    );

    logger.info(`scrapeEvents: ✅ Scraped ${events.length} events.`);

    return events;
  } catch (error) {
    console.error(`scrapeEvents: ❌ Error scraping events: ${error}`);
    throw error;
  }
}
