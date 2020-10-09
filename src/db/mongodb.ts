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

const close = async (): Promise<void> => {
  logger.info('Closing MongoDB connections...');
  if (cachedClient?.isConnected()) {
    await cachedClient.close();
  }
};

const connect = async (): Promise<mongodb.Db> => {
  if (cachedClient?.isConnected()) {
    return cachedClient.db();
  }

  cachedClient = await mongodb.MongoClient.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return cachedClient.db();
};

const createObjectId = (id: string): ObjectId => {
  return new mongodb.ObjectId(id);
};

export { close, connect, createObjectId, MONGO_URI };
