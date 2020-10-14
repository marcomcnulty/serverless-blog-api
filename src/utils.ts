import { iJwtPayload } from './types/jwtTypes/iJwtPayload';
import { decode } from 'jsonwebtoken';

const parseUserId = (jwtString: string): string => {
  const decodedToken: iJwtPayload = decode(jwtString) as iJwtPayload;
  return decodedToken.sub;
};

export const getUserId = (auth): string => {
  const jwtString = auth.split(' ')[1];
  return parseUserId(jwtString);
};

export const handleInvalidPostRequest = () => {
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      error: 'That post does not exist',
    }),
  };
};
