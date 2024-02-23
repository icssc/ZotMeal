import type { AWS } from "@serverless/typescript";

import { functions } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "zotmeal-api",
  useDotenv: true,
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
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
    },
  },
  // import the function via paths
  functions: functions,
  package: {
    individually: true,
    // patterns: ["../../node_modules/.prisma/client/libquery_engine-rhel-*"],
  },
  custom: {
    dotenv: {
      path: "../../.env",
      required: {
        env: ["DATABASE_URL"],
      },
    },
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
