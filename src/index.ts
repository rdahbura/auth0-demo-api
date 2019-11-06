import 'dotenv/config';

import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import logger from './utils/logger';
import { checkJwt } from './utils/security';
import { error, errorLogger, routeNotFound } from './utils/errors';
import { PORT } from './utils/constants';

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
app.listen(PORT, () => {
  logger.info(`Server started listening on port ${PORT}...`);
});
