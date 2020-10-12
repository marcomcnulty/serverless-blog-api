import { iJwtPayload } from './iJwtPayload';
import { JwtHeader } from 'jsonwebtoken';

export interface iJwt {
  header: JwtHeader;
  payload: iJwtPayload;
}
