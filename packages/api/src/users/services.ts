import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle, User } from "@zotmeal/db";
import { UserTable } from "@zotmeal/db";

export const GetUserSchema = z.object({ userId: z.string() });

export interface UserResult {
  userId: string;
  name: string;
  pinnedItems: string[];
  ratedItems: string[];
}

export async function getUser(
  db: Drizzle,
  params: z.infer<typeof GetUserSchema>,
): Promise<UserResult | null> {
  const parsedParams = GetUserSchema.safeParse(params);

  if (!parsedParams.success)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `invalid params: ${parsedParams.error.message}`,
    });

  const { userId } = parsedParams.data;

  const fetchedUser = await db.query.UserTable.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      pins: true,
      ratings: true,
    },
  });

  if (!fetchedUser) return null;

  const pinnedItems = fetchedUser.pins.map((pin) => pin.dishId);
  const ratedItems = fetchedUser.ratings.map((rating) => rating.dishId);

  return {
    userId: fetchedUser.id,
    name: fetchedUser.name,
    pinnedItems,
    ratedItems,
  };
}

// TODO: ? do we want to throw trpc errors in here or in the caller?
export async function upsertUser(
  db: Drizzle,
  params: User,
): Promise<User | null> {
  try {
    const upsertResult = await db
      .insert(UserTable)
      .values(params)
      .onConflictDoUpdate({
        target: UserTable.id,
        set: params,
      })
      .returning();

    const upsertedUser = upsertResult[0];

    if (!upsertedUser || upsertResult.length !== 1)
      throw new Error(
        `expected 1 user to be upserted, but got ${upsertResult.length}`,
      );

    return upsertedUser;
  } catch (e) {
    console.error(e);
    return null;
  }
}
