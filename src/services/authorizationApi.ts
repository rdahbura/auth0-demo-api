import fetch from 'node-fetch';

import logger from '../utils/logger';
import { HttpError, Token } from '../types/http';
import {
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE_MGT_API,
  CLIENT_ID,
  CLIENT_SECRET,
} from '../utils/constants';

const token = new Token();

/**
 * Request a token by using client credentials grant.
 */
export async function getToken(): Promise<Token> {
  if (token.isValid()) {
    logger.info('Returning existing token...');
    return token;
  }

  logger.info('Fetching new token...');

  const url = new URL(`https://${AUTH0_DOMAIN}/oauth/token`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      audience: AUTH0_AUDIENCE_MGT_API,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const body = await response.json();
  const statusCode = response.status;

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  token.type = body.token_type;
  token.value = body.access_token;
  token.expiresIn = body.expires_in;

  return token;
}
