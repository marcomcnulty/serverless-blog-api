import { stringType } from 'aws-sdk/clients/iam';
import * as _ from 'lodash';
import fetch from 'node-fetch';

const APP_ROOT = '../../';
// http for acceptance test, handler for integration test
const mode = process.env.TEST_MODE;

const weInvokeCreatePost = async (user, post) => {
  const body = JSON.stringify(post);

  const requestContext = {};
  requestContext['authorizer'] = {};
  requestContext['authorizer']['principalId'] = user.userId;

  // JWT string
  const token: string = user.token;

  const res =
    mode === 'handler'
      ? await viaHandler({ body, requestContext }, 'createPost')
      : await viaHttp('posts', 'POST', { body, token });

  return res;
};

const weInvokeGetPost = async (userId, postId, token) => {
  // pathParameters and requestContext expected by API Gateway
  const pathParameters = {};
  pathParameters['postId'] = postId;
  pathParameters['userId'] = userId;

  const res =
    mode === 'handler'
      ? await viaHandler({ pathParameters }, 'getPost')
      : await viaHttp(`posts/${userId}/${postId}`, 'GET', { token });

  return res;
};

const viaHttp = async (relPath, method, opts) => {
  // AWS root url for service
  const root = process.env.TEST_ROOT;
  const url = `${root}/${relPath}`;
  console.log(`invoking via HTTP ${method} ${url}`);

  const reqOpts = {};
  reqOpts['method'] = method;

  if (opts.body) {
    reqOpts['body'] = opts.body;
  }

  if (opts.token) {
    const headers = {
      Authorization: `Bearer ${opts.token}`,
    };

    reqOpts['headers'] = headers;
  }

  if (opts.requestContext) {
    reqOpts['requestContext'] = opts.requestContext;
  }

  // if (opts.pathParameters) {
  //   reqOpts['pathParameters'] = opts.pathParameters;
  // }

  try {
    // use fetch for body property that API Gateway expects
    const res = await fetch(url, reqOpts);
    let data;

    if (res.ok) {
      data = await res.json();
    }

    return {
      statusCode: res.status,
      headers: res.headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    if (err.status) {
      return {
        status: err.status,
        headers: err.res.headers,
      };
    } else {
      throw err;
    }
  }
};

const viaHandler = async (event, fnName) => {
  const { handler } = await import(`${APP_ROOT}lambda/http/${fnName}.ts`);
  console.log(`invoking via handler function ${fnName}`);

  if (event.token) {
    event['headers'] = {
      Authorization: `Bearer ${event.token}`,
    };
  }

  const context = {};
  return await handler(event, context);
  // const res = await handler(event, context);
  // const contentType = _.get(res, 'headers.content-type', 'application/json');

  // if (res.body && contentType === 'application/json') {
  //   res.body = JSON.parse(res.body);
  // }

  // return res;
};

export const when = {
  weInvokeCreatePost,
  weInvokeGetPost,
};
