import expressJwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import bcrypt from 'bcryptjs';

import { SALT_ROUNDS } from './constants';

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE_APP_API,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

async function compare(clear: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(clear, hash);
}

async function hash(clear: string): Promise<string> {
  return await bcrypt.hash(clear, SALT_ROUNDS);
}

export { checkJwt, compare, hash };
