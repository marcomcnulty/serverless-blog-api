import axios from 'Axios';
import * as uuid from 'uuid';
import * as dotenv from 'dotenv';
import { when } from './when';

// load environment variables
dotenv.config();

const baseUrl = 'https://dev-f8ud0irk.eu.auth0.com/';

const anAuthenticatedUser = async () => {
  const reqOpts = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: 'https://my-api-gateway.com',
    grant_type: 'client_credentials',
  };

  try {
    // request test access token from Auth0
    const { data } = await axios.post(`${baseUrl}oauth/token`, reqOpts);

    return {
      userId: uuid.v4(),
      token: data.access_token,
    };
  } catch (err) {
    throw err;
  }
};

const aBlogPost = async user => {
  return await when.weInvokeCreatePost(user, {
    title: 'Test Title',
    content: 'This is the content of the blog post',
  });
};

const multipleBlogPosts = async user => {
  const postsArr = [];

  for (let i = 0; i < 3; i++) {
    const res = await when.weInvokeCreatePost(user, {
      title: `Blog post ${i + 1}`,
      content: `This is the content of blog post ${i + 1}`,
    });

    postsArr.push(JSON.parse(res.body));
  }

  return postsArr;
};

export const given = {
  anAuthenticatedUser,
  aBlogPost,
  multipleBlogPosts,
};
