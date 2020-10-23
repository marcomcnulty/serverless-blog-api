import { iJwtPayload } from './types/jwtTypes/iJwtPayload';
import { decode } from 'jsonwebtoken';
import * as winston from 'winston';

const parseUserId = (jwtString: string): string => {
  const decodedToken: iJwtPayload = decode(jwtString) as iJwtPayload;
  return decodedToken.sub;
};

export const getUserId = (auth): string => {
  const jwtString = auth.split(' ')[1];
  return parseUserId(jwtString);
};

export const createLogger = (loggerName: string) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [new winston.transports.Console()],
  });
};
