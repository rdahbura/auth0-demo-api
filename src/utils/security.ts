import expressJwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import bcrypt from 'bcryptjs';

import { AUTH0_AUDIENCE_APP_API, AUTH0_DOMAIN, SALT_ROUNDS } from './constants';

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: AUTH0_AUDIENCE_APP_API,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export async function compare(clear: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(clear, hash);
}

export async function hash(clear: string): Promise<string> {
  return await bcrypt.hash(clear, SALT_ROUNDS);
}

export { checkJwt };
