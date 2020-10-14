import * as _ from 'lodash';
import fetch from 'node-fetch';

const APP_ROOT = '../../';
// http for acceptance test, handler for integration test
const mode = process.env.TEST_MODE;

const weInvokeCreatePost = async (user, post) => {
  // set the userId for post
  post['userId'] = user.userId;

  const body = JSON.stringify(post);
  // JWT string
  const auth: string = user.token;

  const res =
    mode === 'handler'
      ? await viaHandler({ body, auth }, 'createPost')
      : await viaHttp('posts', 'POST', { body, auth });

  return res;
};

const viaHttp = async (relPath, method, opts) => {
  // AWS root url for service
  const root = process.env.TEST_ROOT;
  const url = `${root}/${relPath}`;
  console.log(`invoking via HTTP ${method} ${url}`);

  try {
    const reqOpts = {};
    reqOpts['method'] = method;
    // for post requests
    if (opts.body) {
      reqOpts['body'] = opts.body;
    }

    if (opts.auth) {
      const headers: HeadersInit = {
        Authorization: `Bearer ${opts.auth}`,
      };

      reqOpts['headers'] = headers;
    }

    // use fetch for body property that API Gateway expects
    const res = await fetch(url, reqOpts);

    return {
      statusCode: res.status,
      headers: res.headers,
      body: res.body,
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

  event['headers'] = {
    Authorization: `Bearer ${event.auth}`,
  };

  const context = {};
  const res = await handler(event, context);
  const contentType = _.get(res, 'headers.content-type', 'application/json');

  if (res.body && contentType === 'application/json') {
    res.body = JSON.parse(res.body);
  }

  return res;
};

export const when = {
  weInvokeCreatePost,
};
