import request from 'request';
import util from 'util';

import logger from '../utils/logger';
import { HttpError, Token } from '../types/http';

const token = new Token();

const [postAsync] = [request.post].map(util.promisify);

/**
 * Request a token by using client credentials grant.
 */
export const getToken = async (): Promise<Token> => {
  if (token.isValid()) {
    logger.debug('Returning existing token...');
    return token;
  }

  logger.debug('Fetching new token...');

  const { body, statusCode } = await postAsync({
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    body: {
      grant_type: 'client_credentials',
      audience: process.env.AUTH0_AUDIENCE_MGT_API,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    },
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(body.message, statusCode);
  }

  token.type = body.token_type;
  token.value = body.access_token;
  token.expiresIn = body.expires_in;

  return token;
};
