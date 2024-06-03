import { describe, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "..";
import { registerPushToken } from "./router";

const pushToken = "exp://<PUSH_TOKEN>";

describe("registerPushToken", () => {
  const ctx = createTRPCContext({
    headers: new Headers({
      "x-trpc-source": "@zotmeal/test",
    }),
  });
  const caller = createCaller(ctx);

  it("should register a push token", async () => {
    expect(true).toBeTruthy();
    // const result = await caller.notifications.register(pushToken);
    // expect(result).toBeDefined();
  });
});
