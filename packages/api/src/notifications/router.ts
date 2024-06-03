import { Expo } from "expo-server-sdk";
import { TRPCError } from "@trpc/server";

import { PushTokenSchema, PushTokenTable } from "@zotmeal/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const registerPushToken = publicProcedure
  .input(PushTokenSchema)
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    if (!Expo.isExpoPushToken(input.token)) {
      console.error("pushToken", PushTokenTable);
      throw new TRPCError({
        message: "invalid push token",
        code: "BAD_REQUEST",
      });
    }

    // insert into the database

    await db.insert(PushTokenTable).values(input);
  });

export const notificationRouter = createTRPCRouter({
  register: registerPushToken,
});
