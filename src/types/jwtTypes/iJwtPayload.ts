export interface iJwtPayload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}
