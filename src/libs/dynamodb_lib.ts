import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const AWSXRAY = require('aws-xray-sdk');
const XAWS = AWSXRAY.captureAWS(AWS);

let client: DocumentClient;

if (process.env.IS_OFFLINE) {
  console.log('Creating a local DynamoDB instance');
  client = new XAWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
} else {
  client = new XAWS.DynamoDB.DocumentClient();
}

export default {
  get: params => client.get(params).promise(),
  put: params => client.put(params).promise(),
  query: params => client.query(params).promise(),
  update: params => client.update(params).promise(),
  delete: params => client.delete(params).promise(),
};
