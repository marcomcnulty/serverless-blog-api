import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { createPost } from '../../businessLogic/posts';
import { iPost } from '../../types/iPost';

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<iPost> => {
    console.log('Processing create post event!');
    const postData = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.principalId;

    return await createPost({ ...postData, userId });
  }
);
