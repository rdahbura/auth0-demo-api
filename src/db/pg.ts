import { Pool, QueryResult, QueryResultRow } from 'pg';

import { DATABASE_URL } from '../utils/constants';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true,
});

export async function query<T>(
  text: string,
  values?: T[]
): Promise<QueryResult<QueryResultRow>> {
  return pool.query(text, values);
}
