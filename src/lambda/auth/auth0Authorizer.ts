import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import { verify, decode } from 'jsonwebtoken';
import axios from 'Axios';
import { iJwt } from '../../types/jwtTypes/iJwt';
import { iJwtPayload } from '../../types/jwtTypes/iJwtPayload';

// endpoint for JWK used to sign JWT for this tenant
const jwksUrl = 'https://dev-f8ud0irk.eu.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log(`Processing Auth Event: ${JSON.stringify(event)}`);

  try {
    const jwtPayload: iJwtPayload = await verifyToken(event.authorizationToken);

    return {
      // sub refers to subject - unique identifier
      principalId: jwtPayload.sub,
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
    console.log(`User not authorised! Error: ${err.message}`);

    return {
      // arbitrary value
      principalId: 'user',
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

async function verifyToken(authHeader: string): Promise<iJwtPayload> {
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
    const jwksRes = await axios.get(jwksUrl, reqHeaders);
    const jwks = jwksRes.data.keys;
    // parse and return JWT payload
    const decodedToken: iJwt = decode(token, { complete: true }) as iJwt;
    const publicKey = getPublicKey(jwks, decodedToken);

    return verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as iJwtPayload;
  } catch (err) {
    throw new Error(`Something went wrong: ${err.message}`);
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) {
    throw new Error('No authentication header');
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }
  console.log('Authentication Header is valid!');

  // separates the token from 'Bearer'
  return authHeader.split(' ')[1];
}

function getPublicKey(jwks, jwt) {
  /*
   * filter out keys not intended for verifying JWT and
   * keys missing kid or public key property
   */
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
