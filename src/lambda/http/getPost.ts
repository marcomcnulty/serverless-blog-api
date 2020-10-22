import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { getPost } from '../../businessLogic/posts';
import { iPost } from '../../types/iPost';
import { createLogger } from '../../utils';

const logger = createLogger('getPost');

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<iPost> => {
    logger.info('Processing get post event!');

    const { userId, postId } = event.pathParameters;

    return await getPost({ userId, postId });
  }
);
