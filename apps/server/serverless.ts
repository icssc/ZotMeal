import type { AWS } from "@serverless/typescript";

import { functions } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "peterplate",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    stage: "dev",
    region: "us-west-1",
    runtime: "nodejs20.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DATABASE_URL: process.env.DATABASE_URL,
    },
  },
  functions,
  package: {
    individually: true,
    patterns: ["certs/*", "src/functions/cron/*"],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
