import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { deletePost } from '../../businessLogic/posts';

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<boolean> => {
    console.log('Processing delete post event!');

    const postId = event.pathParameters.postId;
    const userId = event.pathParameters.userId;

    return await deletePost({ userId, postId });
  }
);
