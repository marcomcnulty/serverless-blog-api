import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { getPosts } from '../../businessLogic/posts';
import { iPost } from '../../types/iPost';
import { createLogger } from '../../utils';

const logger = createLogger('getPosts');

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<iPost[]> => {
    logger.info('Processing get posts event!');

    const userId = event.pathParameters.userId;

    return await getPosts(userId);
  }
);
