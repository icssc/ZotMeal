import axios from "axios";
import * as cheerio from "cheerio";

import type { EventParams } from "../models";
import { EventSchema } from "../models";

export async function getHTML(url: string): Promise<string | undefined> {
  try {
    const res = await axios.get(url);
    if (typeof res.data === "string") {
      return res.data;
    }
    throw new Error("response data is not a string");
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error fetching from url: ${url}`, e.message);
    }
  }
}

export function scrapeEvents(html: string): EventParams[] | null {
  try {
    // const html = await getHTML("https://uci.campusdish.com/api/events");
    // if (!html) {
    //   return null;
    // }

    const $ = cheerio.load(html);

    const events: EventParams[] = [];

    // iterate through each event item and extract data
    $("li").each((i, el) => {
      const eventItem = $(el);

      const title = eventItem.find(".gridItem_title_text").text();
      const href = eventItem.find("a").attr("href");
      const link = `https://uci.campusdish.com${href}`;
      const description = eventItem
        .find(".gridItem__body")
        .children()
        .first()
        .text();

      // format into Date object
      const dayString = eventItem
        .find(".disclaimers")
        .children()
        .first()
        .text();
      const timeString = eventItem
        .find(".disclaimers")
        .children()
        .last()
        .text();
      const currentYear = new Date().getFullYear();
      const dateString = `${dayString}, ${currentYear}, ${timeString}`;
      const date = new Date(dateString);

      const event = {
        title,
        link,
        description,
        date,
      };

      const validated = EventSchema.parse(event);

      events.push(validated);
    });

    return events;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
  return null;
}
