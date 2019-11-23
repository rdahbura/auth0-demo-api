import request from 'request';
import util from 'util';

import logger from '../utils/logger';
import { HttpError, Token } from '../types/http';
import {
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE_MGT_API,
  CLIENT_ID,
  CLIENT_SECRET,
} from '../utils/constants';

const token = new Token();

const [postAsync] = [request.post].map(util.promisify);

/**
 * Request a token by using client credentials grant.
 */
export async function getToken(): Promise<Token> {
  if (token.isValid()) {
    logger.info('Returning existing token...');
    return token;
  }

  logger.info('Fetching new token...');

  const { body, statusCode } = await postAsync({
    url: `https://${AUTH0_DOMAIN}/oauth/token`,
    body: {
      grant_type: 'client_credentials',
      audience: AUTH0_AUDIENCE_MGT_API,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    },
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  token.type = body.token_type;
  token.value = body.access_token;
  token.expiresIn = body.expires_in;

  return token;
}
