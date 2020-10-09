import { Pool, QueryResult, QueryResultRow } from 'pg';

import logger from '../utils/logger';
import { DATABASE_URL } from '../utils/constants';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true,
});

const close = async (): Promise<void> => {
  logger.info('Closing PostgreSQL connections...');
  await pool.end();
};

const query = <T>(
  text: string,
  values?: T[]
): Promise<QueryResult<QueryResultRow>> => {
  return pool.query(text, values);
};

export { close, query };
