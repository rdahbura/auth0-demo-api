import request from 'request';
import util from 'util';

import { AUTH0_DOMAIN } from '../utils/constants';
import { HttpError } from '../types/http';
import { IDictionary } from '../types/collections';
import { getToken } from './authorizationApi';

const AUTH0_MGT_API = `https://${AUTH0_DOMAIN}/api/v2`;

const [getAsync, postAsync] = [request.get, request.post].map(util.promisify);

/**
 * Creates a new client application.
 * @param client
 */
export const createClient = async (client: object): Promise<string> => {
  const token = (await getToken()).value;

  const { body, statusCode } = await postAsync({
    url: `${AUTH0_MGT_API}/clients`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: client,
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  return body;
};

/**
 * Retrieves a client by its id.
 * @param id
 * @param qs
 */
export const getClient = async (
  id: string,
  qs: IDictionary
): Promise<string> => {
  const token = (await getToken()).value;

  const { body, statusCode } = await getAsync({
    url: `${AUTH0_MGT_API}/clients/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    qs: qs,
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  return body;
};

/**
 * Retrieves a list of all client applications
 * @param qs
 */
export const getClients = async (qs: IDictionary): Promise<string> => {
  const token = (await getToken()).value;

  const { body, statusCode } = await getAsync({
    url: `${AUTH0_MGT_API}/clients`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    qs: qs,
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  return body;
};

/**
 * Retrieves a user by its id.
 * @param id
 * @param qs
 */
export const getUser = async (id: string, qs: IDictionary): Promise<string> => {
  const token = (await getToken()).value;

  const { body, statusCode } = await getAsync({
    url: `${AUTH0_MGT_API}/users/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    qs: qs,
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  return body;
};

/**
 * Retrieves a list of all userss
 * @param qs
 */
export const getUsers = async (qs: IDictionary): Promise<string> => {
  const token = (await getToken()).value;

  const { body, statusCode } = await getAsync({
    url: `${AUTH0_MGT_API}/users`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    qs: qs,
    json: true,
  });

  if (!/^2/.test('' + statusCode)) {
    throw new HttpError(statusCode, body.message);
  }

  return body;
};
