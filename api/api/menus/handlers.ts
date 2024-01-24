import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MenuParams, MenuParamsSchema } from './models';
import { ZodError } from 'zod';
import { createResponse } from './responses';
import { fetchMenuCampusDish } from './services';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const getMenuHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters) {
    return createResponse(400, { message: 'missing params' });
  }

  const { location, date, meal } = event.queryStringParameters;
  console.log(location, date, meal);

  let params: MenuParams;

  try {
    params = MenuParamsSchema.parse({
      location,
      date,
      meal,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return createResponse(400, { errors: e.issues });
    } else {
      return createResponse(500, {});
    }
  }
  // const menu = getMenuDB(params);
  try {
    const menu = await fetchMenuCampusDish(params);
    return createResponse(200, menu);
  } catch (e) {
    console.log(e);
    return createResponse(500, {});
  }
};
