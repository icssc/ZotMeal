import { TRPCError } from "@trpc/server";

import { UserSchema } from "@zotmeal/db";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { getUser, GetUserSchema, upsertUser } from "./services";

const getUserProcedure = publicProcedure
  .input(GetUserSchema)
  .query(async ({ ctx: { db }, input }) => {
    const user = await getUser(db, input);

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "user not found",
      });

    return user;
  });

const upsertUserProcedure = publicProcedure
  .input(UserSchema)
  .query(async ({ ctx: { db }, input }) => {
    const user = await upsertUser(db, input);

    if (!user)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error upserting user",
      });

    return user;
  });

export const userRouter = createTRPCRouter({
  get: getUserProcedure,
  upsert: upsertUserProcedure,
});
