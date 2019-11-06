const AUTH0_AUDIENCE_APP_API = process.env.AUTH0_AUDIENCE_APP_API;
const AUTH0_AUDIENCE_MGT_API = process.env.AUTH0_AUDIENCE_MGT_API;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_USR = process.env.MONGO_USR;
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const SALT_ROUNDS = 10;

export {
  AUTH0_AUDIENCE_APP_API,
  AUTH0_AUDIENCE_MGT_API,
  AUTH0_DOMAIN,
  CLIENT_ID,
  CLIENT_SECRET,
  DATABASE_URL,
  MONGO_CLUSTER,
  MONGO_DB,
  MONGO_PWD,
  MONGO_USR,
  NODE_ENV,
  PORT,
  SALT_ROUNDS,
};
