const axios = require('Axios');
const uuid = require('uuid');
const baseUrl = `https://dev-f8ud0irk.eu.auth0.com/`;

const anAuthenticatedUser = async () => {
  const reqOpts = {
    method: 'POST',
    url: `${baseUrl}oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: "https://my-api-gateway.com",
        grant_type: "client_credentials"
      }
    )};

    try {
      const { access_token } = await axios(reqOpts);

      return {
        userId: uuid.v4(),
        token: access_token
      }
    } catch (err) {
      alert(`Error: ${err}`);
      throw new Error(err.message)
    }
  }

module.exports = {
  anAuthenticatedUser,
};


// const { jwt } = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');

// const client = jwksClient({
//   jwksUri: "https://dev-f8ud0irk.eu.auth0.com/.well-known/jwks.json"
// });

// const verifyAuth0Token = async token => {
  //   return new Promise((resolve, reject) => {
  //     jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }

  //       resolve(decoded);
  //     });
  //   });
  // };

  // const getKey = (header, callback) => {
  //   client.getSigningKey(header.kid, function(err, key) {
  //     if (err) {
  //       callback(err);
  //       return;
  //     }
  //     const signingKey = key.getPublicKey();

  //     callback(null, signingKey);
  //   });
  // };

  // const authorizeApp = async () => {
  //   const res = await axios.get(`${baseUrl}authorize`)
  // }
