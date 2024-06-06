import { TRPCError } from "@trpc/server";

import type { Drizzle, Pin, Rating, User } from "@zotmeal/db";
import { UserTable } from "@zotmeal/db";

export async function getUser(
  db: Drizzle,
  id: string,
): Promise<
  User & {
    pins: Pin[];
    ratings: Rating[];
  }
> {
  const fetchedUser = await db.query.UserTable.findFirst({
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

export async function upsertUser(db: Drizzle, user: User): Promise<User> {
  const upsertResult = await db
    .insert(UserTable)
    .values(user)
    .onConflictDoUpdate({
      target: UserTable.id,
      set: user,
    })
    .returning();

  const upsertedUser = upsertResult[0];

  if (!upsertedUser || upsertResult.length !== 1)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `expected 1 user to be upserted, but got ${upsertResult.length}`,
    });

  return upsertedUser;
}
