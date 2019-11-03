require('dotenv').config();

const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_PWD = process.env.MONGO_PASSWORD;
const MONGO_USR = process.env.MONGO_USERNAME;

const SALT_ROUNDS = 10;

export { MONGO_CLUSTER, MONGO_DB, MONGO_PWD, MONGO_USR, SALT_ROUNDS };
