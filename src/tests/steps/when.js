const axios = require('Axios');

const weInvokeCreatePost = async (user, post) => {
  // set the userId from the user info
  post['userId'] = user.userId

  const body = JSON.stringify(post);
  const auth = user.token;

  return await viaHttp('posts', 'POST', { body, auth });
}

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
      const headers = { Authorization: user.token }

      config = {
        ...config,
        headers
      }
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
        headers: err.response.headers,
      };
    } else {
      throw err;
    }
  }
}

module.export = {
  weInvokeCreatePost
}
