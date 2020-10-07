import { verify, decode } from 'jsonwebtoken';
import Axios from 'axios';

// endpoint for JWK used to sign JWT for this tenant
const jwksUrl = 'https://dev-f8ud0irk.eu.auth0.com/.well-known/jwks.json';

export const handler = async event => {
  console.log(`Processing Auth Event: ${event}`);

  try {
    const jwtToken = await verifyToken(event.authorizationToken);

    return {
      principalId: jwtToken.sub, // sub refers to subject - unique identifier
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  } catch (err) {
    alert(`User not authorised! Error: ${err.message}`);

    return {
      principalId: 'user', // arbitrary value
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader) {
  const reqHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };

  // retrieve token from event header
  const token = getToken(authHeader);

  try {
    // get public keys used to verify auth0 RS256 signature
    const jwksRes = await Axios.get(jwksUrl, reqHeaders);
    const jwks = jwksRes.data.keys;

    // parse and return JWT payload
    const decodedJwt = decode(token, { complete: true });
    const publicKey = getPublicKey(jwks, decodedJwt);

    return verify(token, publicKey, {
      algorithms: ['RS256'],
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Something went wrong: ${err.message}`);
  }
}

function getToken(authHeader) {
  if (!authHeader) {
    console.log('No authentication header');
    throw new Error('No authentication header');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    console.log('Invalid authentication header');
    throw new Error('Invalid authentication header');
  }
  console.log('Authentication Header is valid!');

  return authHeader.split(' ')[1];
}

function getPublicKey(jwks, jwt) {
  // filter out keys not intended for verifying JWT and
  // keys missing kid or public key property
  const keys = jwks
    .filter(
      key =>
        key.use === 'sig' &&
        key.kty === 'RSA' &&
        key.kid &&
        ((key.x5c && key.x5c.length) || (key.n && key.e))
    )
    .map(key => ({
      kid: key.kid,
      nbf: key.nbf,
      pem: certToPEM(key.x5c[0]),
    }));

  // retrieve key used to sign JWT
  const signingKey = keys.find(key => key.kid === jwt.header.kid);

  if (!signingKey) {
    console.log('No signing key found');
    throw new Error('No signing key found');
  }
  console.log('Signing key found! ', signingKey);

  return signingKey.pem;
}

function certToPEM(cert) {
  let pem = cert.match(/.{1,64}/g).join('\n');
  pem = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;

  return pem;
}
