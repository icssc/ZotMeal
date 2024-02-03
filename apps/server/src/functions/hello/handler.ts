import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "@acme/api";

const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  const ctx = createTRPCContext({});
  return { ...ctx, event, context };
};

type Context = Awaited<ReturnType<typeof createContext>>;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export const main = handler;
