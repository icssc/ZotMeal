import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "@zotmeal/api";

const createContext = (
  _opts: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>,
) => {
  const headers = new Headers();
  headers.set("x-trpc-source", "aws-lambda");
  return createTRPCContext({ headers });
};
// type Context = Awaited<ReturnType<typeof createContext>>;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export const main = handler;
