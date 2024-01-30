import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { appRouter, createTRPCContext } from "@acme/api";
import { APIGatewayProxyEventV2 } from "aws-lambda";

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

// const handler = async (event) => {
//   const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: `Hello ${"hello"} !`,
//       data: res.data,
//     }),
//   };
// };

export const main = handler;
