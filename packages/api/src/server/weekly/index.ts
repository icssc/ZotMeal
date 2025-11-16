import { upsertEvents } from "@api/events/services";
import { logger } from "@api/logger";

import type { Drizzle } from "@zotmeal/db";

import { Octokit } from "@octokit/rest";
import { upsert } from "@api/utils";
import { contributors, InsertContributor } from "@zotmeal/db";
import { getAEMEvents } from "../daily/parse";

/**
 * Query the GraphQL Events Endpoint for both restaurants and upsert them into 
 * the database.
 * @param db The Drizzle database instance to insert into.
 */
export async function eventJob(db: Drizzle): Promise<void> {
  const brandywineEvents = await getAEMEvents("Brandywine");
  const anteateryEvents = await getAEMEvents("The Anteatery");

  logger.info(`[weekly] Upserting ${brandywineEvents.length + anteateryEvents.length} events...`)
  const upsertedEvents = await upsertEvents(db, brandywineEvents.concat(anteateryEvents));
  logger.info(`[weekly] Upserted ${upsertedEvents} events.`)
}


/**
 * Query the GitHub API to obtain the contributors to ZotMeal's GH Repo.
 * @param db The Drizzle database instance to insert into.
 */
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

/**
 * Finds the closest Sunday that occurred in the past relative to the given date.
 * If the input date is already a Sunday, it returns that date.
 *
 * @param {Date} date The starting date
 * @returns {Date} A new Date object representing the closest Sunday in the past
 */
export function findClosestPastSunday(date: Date): Date {
  const targetDate = new Date(date.getTime());
  targetDate.setDate(targetDate.getDate() - targetDate.getDay());
  return targetDate;
}

export async function weekly(db: Drizzle): Promise<void> {
  await eventJob(db);
  // await contributorsJob(db);

  // const results = await Promise.allSettled(
  //   restaurantNames.map(async (restaurant) =>
  //     restaurantJob(db, new Date(), restaurant),
  //   ),
  // );

  // Log errors.
  // results.forEach((result) => {
  //   if (result.status === "rejected")
  //     logger.error("weekly() failed:", result.reason);
  // });
}
