import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { deletePost } from '../../businessLogic/posts';
import { createLogger } from '../../utils';

const logger = createLogger('deletePost');

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<boolean> => {
    logger.info('Processing delete post event!');

    const postId = event.pathParameters.postId;
    const userId = event.requestContext.authorizer.principalId;

    return await deletePost({ userId, postId });
  }
);
