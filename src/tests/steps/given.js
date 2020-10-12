import axios from 'axios';
import * as uuid from 'uuid';

const baseUrl = 'https://dev-f8ud0irk.eu.auth0.com/';

const anAuthenticatedUser = async () => {
  const reqOpts = {
    method: 'POST',
    url: `${baseUrl}oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: 'https://my-api-gateway.com',
        grant_type: 'client_credentials',
      }
    )};

  try {
    const { access_token } = await axios(reqOpts);

    return {
      userId: uuid.v4(),
      token: access_token,
    };
  } catch (err) {
    alert(`Error: ${err}`);
    throw new Error(err.message);
  }
};

export {
  anAuthenticatedUser,
};
