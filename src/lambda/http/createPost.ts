import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import { iCreatePostRequest } from '../../types/requestTypes/iCreatePostRequest';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(`Processing event: ${event}`);

  const newPost: iCreatePostRequest = JSON.parse(event.body);
  console.log(`New post: ${newPost}`);

  const params = {
    TableName: process.env.POSTS_TABLE,
    Item: {
      userId: newPost.userId,
      postId: uuid.v4(),
      title: newPost.title,
      content: newPost.content,
      coverUrl: newPost.coverUrl,
      createdAt: new Date().toISOString(),
    },
  };

  // response headers enabling CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(params.Item),
    };
  } catch (err) {
    alert(`Error: ${err}`);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: false }),
    };
  }
};
