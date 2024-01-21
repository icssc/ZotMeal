import { APIGatewayProxyResult } from 'aws-lambda';

export function createResponse(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
}
