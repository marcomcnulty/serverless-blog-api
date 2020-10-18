import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { getPost } from '../../businessLogic/posts';
import { iPost } from '../../types/iPost';

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<iPost> => {
    console.log('Processing get post event!');

    const postId = event.pathParameters.postId;
    const userId = event.pathParameters.userId;

    return await getPost({ userId, postId });
  }
);
