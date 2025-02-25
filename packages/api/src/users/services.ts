import { upsert } from "@api/utils";
import { TRPCError } from "@trpc/server";

import type {
  Drizzle,
  InsertUser,
  SelectPin,
  SelectRating,
  SelectUser,
} from "@zotmeal/db";
import { users } from "@zotmeal/db";

export async function getUser(
  db: Drizzle,
  id: string,
): Promise<
  SelectUser & {
    pins: SelectPin[];
    ratings: SelectRating[];
  }
> {
  const fetchedUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    with: {
      pins: true,
      ratings: true,
    },
  });

  if (!fetchedUser)
    throw new TRPCError({ code: "NOT_FOUND", message: "user not found" });

  return fetchedUser;
}

export const upsertUser = async (db: Drizzle, user: InsertUser) =>
  await upsert(db, users, user, {
    target: users.id,
    set: user,
  });
