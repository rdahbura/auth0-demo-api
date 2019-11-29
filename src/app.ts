import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './utils/logger';
import { PORT } from './utils/constants';
import { checkJwt } from './utils/security';
import { close as closeMongodb } from './db/mongodb';
import { close as closePostgreSQL } from './db/postgresql';
import { error, errorLogger, routeNotFound } from './utils/errors';

import routes from './routes';

function start(): void {
  // Create application instance
  const app = express();

  // Assign application settings
  app.set('port', PORT);

  // Configure logging
  app.use(morgan('dev'));

  // Configure middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(checkJwt);

  // Configure routes
  app.use('/api', routes);
  app.use(routeNotFound);

  // Configure error handlers
  app.use(errorLogger);
  app.use(error);

  // Start http server
  const server = app.listen(PORT, () => {
    logger.info(`Server started listening on port ${PORT}...`);
  });

  async function shutdown(): Promise<void> {
    await closeMongodb();
    await closePostgreSQL();
    server.close();
    process.exit();
  }

  process.on('SIGINT', async () => await shutdown());
  process.on('SIGTERM', async () => await shutdown());
}

export default start;
