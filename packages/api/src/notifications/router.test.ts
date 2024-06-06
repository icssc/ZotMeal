import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { registerPushToken } from "./router";

const pushToken = "exp://<PUSH_TOKEN>";

describe("registerPushToken", () => {
  apiTest.todo("should register push token", () => {
    // const result = await caller.notifications.register(pushToken);
    // expect(result).toBeDefined();
  });
});
