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

const hashCompare = async (clear: string, hash: string): Promise<boolean> => {
  const result = await bcrypt.compare(clear, hash);
  return result;
};

const hash = async (clear: string): Promise<string> => {
  const result = await bcrypt.hash(clear, SALT_ROUNDS);
  return result;
};

export { checkJwt, hash, hashCompare };
