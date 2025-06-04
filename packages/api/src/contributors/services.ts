import { contributors, Drizzle, SelectContributor } from "@zotmeal/db";

/**
 * Gets all rows from the contributors table. Fetches all of the contributors
 * that have been pulled from the weekly job.
 */
export async function getContributors(db: Drizzle) : Promise<SelectContributor[]> {
   return await db.select().from(contributors);
}