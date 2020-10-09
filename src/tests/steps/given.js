const { jwt } = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: "https://dev-f8ud0irk.eu.auth0.com/.well-known/jwks.json"
});

const axios = require('Axios');

const baseUrl = `https://dev-f8ud0irk.eu.auth0.com/`;

const verifyAuth0Token = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(decoded);
    });
  });
};

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.getPublicKey();

    callback(null, signingKey);
  });
};

const authorizeApp = async () => {
  const res = await axios.get(`${baseUrl}authorize`)
}

// const anAuthenticatedUser = () => {

// }

module.exports = {
  verifyAuth0Token,
};
