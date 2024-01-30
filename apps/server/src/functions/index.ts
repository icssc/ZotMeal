import type { AWS } from "@serverless/typescript";

export const functions: AWS["functions"] = {
  hello: {
    handler: "src/functions/hello/handler.main",
    description: "Lambda function to say hello",
    memorySize: 256,
    events: [
      {
        http: {
          method: "any", // Match any HTTP method
          path: "/{proxy+}", // Use a catch-all wildcard here
          cors: true,
        },
      },
    ],
  },
};
