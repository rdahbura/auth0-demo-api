import fetch from 'node-fetch';
import { Query } from 'express-serve-static-core';

import { AUTH0_DOMAIN } from '../../utils/constants';
import { HttpError } from '../../types/http';
import { getToken } from '../authorization';

const AUTH0_MGT_API = `https://${AUTH0_DOMAIN}/api/v2`;

/**
 * Retrieves a list of all userss
 * @param qs
 */
export async function getUsers(qs: Query): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/users`);
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
 * Retrieves a user by its id.
 * @param id
 * @param qs
 */
export async function getUser(id: string, qs: Query): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/users/${id}`);
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
 * Updates a user.
 * @param id
 * @param body
 */
export async function updateUser(
  id: string,
  body: Record<string, unknown>
): Promise<string> {
  const token = (await getToken()).value;

  const url = new URL(`${AUTH0_MGT_API}/users/${id}`);

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const resJson = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, resJson.message);
  }

  return resJson;
}
