import lambdaHandler from '../../libs/lambdaHandler_lib';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { iCreatePostRequest } from '../../types/requestTypes/iCreatePostRequest';
import { createPost } from '../../businessLogic/posts';

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing create post event!');

    const data: iCreatePostRequest = JSON.parse(event.body);
    console.log(`New post: ${JSON.stringify(data)}`);

    // response headers enabling CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };

    try {
      const newPost = await createPost(data, event.headers);

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(newPost),
      };
    } catch (err) {
      console.log(err);

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ status: false }),
      };
    }
  }
);
