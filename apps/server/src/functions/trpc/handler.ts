import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "@zotmeal/api";

const createContext = (
  _opts: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>,
) => {
  return createTRPCContext({
    headers: new Headers({
      "x-trpc-source": "@zotmeal/aws-lambda",
    }),
  });
};
// type Context = Awaited<ReturnType<typeof createContext>>;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export const main = handler;
