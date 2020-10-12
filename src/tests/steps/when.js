import axios from 'Axios';
import _ from 'lodash';

const APP_ROOT = '../../../';
const mode = process.env.TEST_MODE;

const weInvokeCreatePost = async (user, post) => {
  // set the userId from the user info
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
  const root = process.env.TEST_ROOT;
  const url = `${root}/${relPath}`;
  console.log(`invoking via HTTP ${method} ${url}`);

  try {
    let config = {
      method,
      url,
    };

    // when making a post request
    if (opts.body) {
      config['data'] = body;
    }

    if (user.token) {
      const headers = { Authorization: `Bearer ${user.token}` };

      config = {
        ...config,
        headers,
      };
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
  const handler = require(`${APP_ROOT}/lambda/${fnName}`).handler;
  console.log(`invoking via handler function ${fnName}`);

  const context = {};
  const res = await handler(event, context);
  const contentType = _.get(
    res,
    'headers.content-type',
    'application/json'
  );

  if (res.body && contentType === 'application/json') {
    res.body = JSON.parse(res.body);
  }

  return res;
};

export const when = {
  weInvokeCreatePost,
};
