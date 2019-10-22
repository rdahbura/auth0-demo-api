import expressJwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export default expressJwt({
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
