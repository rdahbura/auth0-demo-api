import fetch from 'node-fetch';
import { Query } from 'express-serve-static-core';

import { AUTH0_DOMAIN } from '../../utils/constants';
import { HttpError } from '../../types/http';
import { getToken } from '../authorization';

const AUTH0_MGT_API = `https://${AUTH0_DOMAIN}/api/v2`;

/**
 * Creates a new client application.
 * @param client
 */
export async function createClient(
  client: Record<string, unknown>
): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/clients`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });

  const resJson = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, resJson.message);
  }

  return resJson;
}

/**
 * Retrieves a client by its id.
 * @param id
 * @param qs
 */
export async function getClient(id: string, qs: Query): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/clients/${id}`);
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
}

/**
 * Retrieves a list of all client applications
 * @param qs
 */
export async function getClients(qs: Query): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/clients`);
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
}
