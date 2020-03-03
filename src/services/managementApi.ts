import fetch from 'node-fetch';

import { AUTH0_DOMAIN } from '../utils/constants';
import { HttpError } from '../types/http';
import { IDictionary } from '../types/collections';
import { getToken } from './authorizationApi';

const AUTH0_MGT_API = `https://${AUTH0_DOMAIN}/api/v2`;

/**
 * Creates a new client application.
 * @param client
 */
export async function createClient(client: object): Promise<string> {
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

  const body = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, body.message);
  }

  return body;
}

/**
 * Retrieves a client by its id.
 * @param id
 * @param qs
 */
export async function getClient(
  id: string,
  qs: IDictionary<string>
): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/clients/${id}`);
  Object.keys(qs).forEach((key) => url.searchParams.append(key, qs[key]));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, body.message);
  }

  return body;
}

/**
 * Retrieves a list of all client applications
 * @param qs
 */
export async function getClients(qs: IDictionary<string>): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/clients`);
  Object.keys(qs).forEach((key) => url.searchParams.append(key, qs[key]));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, body.message);
  }

  return body;
}

/**
 * Retrieves a user by its id.
 * @param id
 * @param qs
 */
export async function getUser(
  id: string,
  qs: IDictionary<string>
): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/users/${id}`);
  Object.keys(qs).forEach((key) => url.searchParams.append(key, qs[key]));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, body.message);
  }

  return body;
}

/**
 * Retrieves a list of all userss
 * @param qs
 */
export async function getUsers(qs: IDictionary<string>): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/users`);
  Object.keys(qs).forEach((key) => url.searchParams.append(key, qs[key]));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, body.message);
  }

  return body;
}
