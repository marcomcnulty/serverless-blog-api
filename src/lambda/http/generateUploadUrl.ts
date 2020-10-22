import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { lambdaHandler } from '../../libs/lambdaHandler_lib';
import { generateUploadUrl, setCoverUrl } from '../../businessLogic/posts';
import { createLogger } from '../../utils';

const logger = createLogger('generateUploadURL');

export const handler: APIGatewayProxyHandler = lambdaHandler(
  async (event: APIGatewayProxyEvent, context): Promise<string> => {
    logger.info(`Processing generate upload url event`);

    const userId = event.requestContext.authorizer.principalId;
    const postId = event.pathParameters.postId;

    const uploadUrl: string = await generateUploadUrl(
      event.pathParameters.postId
    );

    await setCoverUrl(userId, postId);

    return uploadUrl;
  }
);
