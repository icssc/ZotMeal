import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "test-setup.ts",
    minWorkers: 1,
    maxWorkers: 1,
    // maxConcurrency: 5, // default is 5
    // fileParallelism: false, // default is true
  },
});
