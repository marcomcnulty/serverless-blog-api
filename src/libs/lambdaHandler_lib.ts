import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const lambdaHandler = lambda => {
  return async function (
    event: APIGatewayProxyEvent,
    context
  ): Promise<APIGatewayProxyResult> {
    let body: any, statusCode: number;

    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      // response headers enabling CORS
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  };
};
