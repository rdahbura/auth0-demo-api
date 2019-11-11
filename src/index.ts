import 'dotenv/config';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './utils/logger';
import { PORT } from './utils/constants';
import { checkJwt } from './utils/security';
import { close as closeMongodb } from './db/mongodb';
import { close as closePg } from './db/pg';
import { error, errorLogger, routeNotFound } from './utils/errors';

import routes from './routes';

const app = express();

// Configure logging
app.use(morgan('dev'));

// Configure middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(checkJwt);

// Configure routes
app.use('/api', routes);
app.use(routeNotFound);

// Configure error handlers
app.use(errorLogger);
app.use(error);

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server started listening on port ${PORT}...`);
});

async function shutdown(): Promise<void> {
  await closeMongodb();
  await closePg();
  server.close();
}

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((v) => {
  process.on(v, async () => {
    await shutdown();
    process.exit();
  });
});
