import mongodb, { ObjectId } from 'mongodb';

import logger from '../utils/logger';
import {
  MONGO_CLUSTER,
  MONGO_DB,
  MONGO_PWD,
  MONGO_USR,
} from '../utils/constants';

const MONGO_URI = `mongodb+srv://${MONGO_USR}:${MONGO_PWD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true`;

let cachedClient: mongodb.MongoClient;

export async function close(): Promise<void> {
  logger.debug('Closing MongoDB connections...');
  if (cachedClient?.isConnected()) {
    await cachedClient.close();
  }
}

export async function connect(): Promise<mongodb.Db> {
  if (cachedClient?.isConnected()) {
    return cachedClient.db();
  }

  const client = await mongodb.MongoClient.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;

  return cachedClient.db();
}

export function createObjectId(id: string): ObjectId {
  return new mongodb.ObjectId(id);
}
