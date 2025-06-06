import { upsertEvents } from "@api/events/services";
import { logger } from "@api/logger";
import { addDays, format } from "date-fns";

import type { Drizzle, RestaurantName } from "@zotmeal/db";
import { restaurantNames } from "@zotmeal/db";

import { daily } from "../daily";
import { getHTML, scrapeEvents } from "../scrapeEvents";
import { Octokit } from "@octokit/rest";
import { upsert } from "@api/utils";
import { contributors, InsertContributor } from "@zotmeal/db";

const NUM_DAYS_UPDATE = 14;

/**
 * Scrape and upsert events from CampusDish.
 * The endpoint contains events from both restaurants.
 */
export async function eventJob(db: Drizzle): Promise<void> {
  const html = await getHTML(
    "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
  );
  const events = await scrapeEvents(html);

  logger.info(`[weekly] Upserting ${events.length} events...`);
  const upsertedEvents = await upsertEvents(db, events);
  logger.info(`[weekly] Upserted ${upsertedEvents.length} events.`);
}

/**
 * Executes a {@link daily} job {@link NUM_DAYS_UPDATE} days out starting from the given date.
 */
export async function restaurantJob(
  db: Drizzle,
  date: Date,
  restaurant: RestaurantName,
): Promise<void> {
  await eventJob(db);

  const results = await Promise.allSettled(
    Array.from({ length: NUM_DAYS_UPDATE }).map((_, i) =>
      daily(db, addDays(date, i), restaurant),
    ),
  );

  // Log errors.
  results.forEach((result, i) => {
    if (result.status === "rejected")
      logger.error(
        result,
        `weekly: Error updating day ${format(addDays(date, i), "yyyy-MM-dd")}:`,
      );
  });
}


export async function contributorsJob(db: Drizzle) {
  const octokit = new Octokit();
  let page = 1;
  let hasNextPage = true;
  let baseContributors: any[] = [];

  while (hasNextPage) {
    const { data } = await octokit.rest.repos.listContributors({
      owner: "icssc",
      repo: "ZotMeal",
      per_page: 100,
      page,
    });

    baseContributors = baseContributors.concat(data);
    hasNextPage = data.length === 100;
    page++;
  }

  // Filter out bots 
  const filteredContributors = baseContributors.filter(
    (contributor) =>
      contributor.type !== "Bot"
  );

  // Fetch detailed info for each contributor
  let detailedContributors: InsertContributor[] = await Promise.all(
    filteredContributors.map(async (contributor) => {
      const { data: userDetails } = await octokit.rest.users.getByUsername({
        username: contributor.login,
      });
      return {
        ...contributor,
        name: userDetails.name,
        bio: userDetails.bio,
      };
    })
  );

  logger.info(`[weekly] Upserting ${detailedContributors.length} contributors...`)
  const upsertedContributors = await upsertContributors(db, detailedContributors);
  logger.info(`[weekly] Upserted ${upsertedContributors.length} contributors.`)
}

export async function upsertContributors(
  db: Drizzle,
  contributorsArray : InsertContributor[]
) {
  const upsertContributorsResult = await Promise.allSettled(
    contributorsArray.map(
      async (contributor) =>
        upsert(db, contributors, contributor, {
          target: contributors.login,
          set: contributor
        })
    )
  )

  upsertContributorsResult.forEach((result) => {
    if (result.status === "rejected")
      logger.error(result, "upsertContributors(): ");
  });

  return upsertContributorsResult;
}


export async function weekly(db: Drizzle): Promise<void> {
  await eventJob(db);

  await contributorsJob(db);

  const results = await Promise.allSettled(
    restaurantNames.map(async (restaurant) =>
      restaurantJob(db, new Date(), restaurant),
    ),
  );

  // Log errors.
  results.forEach((result) => {
    if (result.status === "rejected")
      logger.error("weekly() failed:", result.reason);
  });
}
