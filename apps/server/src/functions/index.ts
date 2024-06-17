import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  api: {
    handler: "src/functions/trpc/handler.main",
    description: "Entry point for all tRPC routes defined within the appRouter",
    memorySize: 256,
    events: [
      {
        http: {
          method: "any", // Match any HTTP method
          path: "/{proxy+}", // Using a catch-all wildcard here
          cors: true,
        },
      },
    ],
  },
  testLog: {
    handler: "src/functions/cron/testLog.main",
    description: "Log a test message",
    events: [
      {
        schedule: {
          rate: ["cron(* * * * ? *)"], // Runs every min. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html
          enabled: true,
        },
      },
    ],
  },
  weekly: {
    handler: "src/functions/cron/weekly.main",
    description: "Fetch and process weekly data",
    timeout: 600,
    events: [
      {
        schedule: {
          rate: ["cron(0 0 ? * 1 *)"], // Runs at 00:00 on Sunday. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html
          enabled: true,
        },
      },
    ],
  },
  daily: {
    handler: "src/functions/cron/daily.main",
    description: "Fetch and process daily data",
    timeout: 600,
    events: [
      {
        schedule: {
          rate: ["cron(0 0 * * ? *)"], // Run daily at 00:00. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html
          enabled: true,
        },
      },
    ],
  },
};
