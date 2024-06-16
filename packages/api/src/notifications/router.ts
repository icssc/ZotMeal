import { Expo } from "expo-server-sdk";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";

import { pushTokens, PushTokenSchema } from "@zotmeal/db";

export const registerPushToken = publicProcedure
  .input(PushTokenSchema)
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    if (!Expo.isExpoPushToken(input.token)) {
      console.error("pushToken", pushTokens);
      throw new TRPCError({
        message: "invalid push token",
        code: "BAD_REQUEST",
      });
    }

    // insert into the database

    await db.insert(pushTokens).values(input);
  });

export const notificationRouter = createTRPCRouter({
  /**
   * Register a push token.
   */
  register: registerPushToken,
});
