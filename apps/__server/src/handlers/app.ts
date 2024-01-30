/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import axios from "axios";

// // import axios from "axios";

// export const lambdaHandler = async (
//   event: APIGatewayProxyEvent,
// ): Promise<APIGatewayProxyResult> => {
//   const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
//   console.log(res.data);
//   try {
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: "hello world",
//       }),
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: "some error happened",
//       }),
//     };
//   }
// };

// export const lambdaHandler = awsLambdaRequestHandler({
//   router:
// })

import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "@acme/api";

function createContext({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) {
  const ctx = createTRPCContext({});
  return {
    ...ctx,
    event: event,
    ...context,
  };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;
export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
  responseMeta() {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    };
  },
});
