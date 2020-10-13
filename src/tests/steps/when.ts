import axios from 'Axios';
import * as _ from 'lodash';

const APP_ROOT = '../../';
// http for acceptance test, handler for integration test
const mode = process.env.TEST_MODE;

const weInvokeCreatePost = async (user, post) => {
  // set the userId for post
  post['userId'] = user.userId;

  const body = JSON.stringify(post);
  const auth = user.token;

  const res =
    mode === 'handler'
      ? await viaHandler({ body }, 'createPost')
      : await viaHttp('posts', 'POST', { body, auth });

  return res;
};

const viaHttp = async (relPath, method, opts) => {
  // AWS root url for service
  const root = process.env.TEST_ROOT;
  const url = `${root}/${relPath}`;
  console.log(`invoking via HTTP ${method} ${url}`);

  try {
    let config = {
      method,
      url,
    };

    // for post requests
    if (opts.body) {
      config['data'] = opts.body;
    }

    const { auth } = opts;

    if (auth.token) {
      const headers = { Authorization: `Bearer ${auth.token}` };
      config['headers'] = { headers };
    }

    const res = await axios(config);

    return {
      statusCode: res.status,
      headers: res.headers,
      body: res.data,
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
