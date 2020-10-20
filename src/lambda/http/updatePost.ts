import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { updatePost } from '../../businessLogic/posts';
import { iPost } from '../../types/iPost';

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<iPost> => {
    console.log('Processing update post event!');

    const updateData = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.principalId;
    const postId = event.pathParameters.postId;

    return await updatePost({ ...updateData, userId, postId });
  }
);
