import axios from 'Axios';
import * as uuid from 'uuid';
import * as dotenv from 'dotenv';

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

export const given = {
  anAuthenticatedUser,
};
