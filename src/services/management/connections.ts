import fetch from 'node-fetch';
import { Query } from 'express-serve-static-core';

import { AUTH0_DOMAIN } from '../../utils/constants';
import { HttpError } from '../../types/http';
import { getToken } from '../authorization';

const AUTH0_MGT_API = `https://${AUTH0_DOMAIN}/api/v2`;

/**
 * Retrieves a list of all connections
 * @param qs
 */
const getConnections = async (qs: Query): Promise<string> => {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/connections`);
  Object.keys(qs).forEach((key) =>
    url.searchParams.append(key, qs[key] as string)
  );

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resJson = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, resJson.message);
  }

  return resJson;
};

/**
 * Retrieves a connection by its id.
 * @param id
 * @param qs
 */
const getConnection = async (id: string, qs: Query): Promise<string> => {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/connections/${id}`);
  Object.keys(qs).forEach((key) =>
    url.searchParams.append(key, qs[key] as string)
  );

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resJson = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, resJson.message);
  }

  return resJson;
};

export { getConnection, getConnections };
