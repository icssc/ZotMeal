// import {
//   awsLambdaRequestHandler,
//   CreateAWSLambdaContextOptions,
// } from "@trpc/server/adapters/aws-lambda";
// import { APIGatewayProxyEventV2 } from "aws-lambda";

// import { appRouter, createTRPCContext } from "@zotmeal/api";

// const createContext = (
//   _opts: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>,
// ) =>
//   createTRPCContext({
//     headers: new Headers({
//       "x-trpc-source": "zotmeal-lambda",
//     }),
//     connectionString: process.env.DATABASE_URL,
//   });

// // type Context = Awaited<ReturnType<typeof createContext>>;

// export const handler = awsLambdaRequestHandler({
//   router: appRouter,
//   createContext,
// });

// export const main = handler;

import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "@zotmeal/api";

const createContext = (
  opts: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>,
) =>
  createTRPCContext({
    headers: new Headers({
      "x-trpc-source": "zotmeal-lambda",
    }),
    connectionString: process.env.DATABASE_URL,
  });

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  // console.log("Full event:", JSON.stringify(event, null, 2));
  
  // Try multiple path sources
  const path = 
    event.rawPath || 
    event.requestContext?.http?.path || 
    event.pathParameters?.proxy ||
    "";
  
  // Also check the body for tRPC batch requests
  // const body = event.body ? JSON.parse(event.body) : null;
  
  // console.log("Extracted path:", path);
  // console.log("Body:", body);
  // console.log("Headers:", event.headers);
  
  // Block requests to /api/auth/* or /auth/*
  if (path.includes("/api/auth") || path.includes("/auth")) {
    console.log("Blocked auth route:", path);
    return {
      statusCode: 404,
      body: JSON.stringify({ 
        error: "Not found - auth routes are handled separately" 
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  // Pass through to tRPC handler
  const trpcHandler = awsLambdaRequestHandler({
    router: appRouter,
    createContext,
  });
  
  return trpcHandler(event);
};

export const main = handler;