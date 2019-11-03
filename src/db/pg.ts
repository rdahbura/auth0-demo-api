import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export function query<T>(
  text: string,
  values?: T[]
): Promise<QueryResult<QueryResultRow>> {
  return pool.query(text, values);
}
