import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async event => {
  console.log(`Processing event: ${event}`);

  const data = JSON.parse(event.body);
  console.log(`New post: ${data}`);

  const params = {
    TableName: process.env.POSTS_TABLE,
    Item: {
      // Cognito Identity Pool identity id
      userId: event.requestContext.identity.cognitoIdentityId,
      postId: uuid.v4(),
      title: data.title,
      content: data.content,
      coverUrl: data.coverUrl,
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
