import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index';
import clientsRouter from './routes/clients';
import usersRouter from './routes/users';

import logger from './utils/logger';
import jwtCheck from './utils/jwt';
import { error, error404 } from './utils/error';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(jwtCheck);

app.use('/api', indexRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/users', usersRouter);

app.use(error404);
app.use(error);

app.listen(PORT, () => {
  logger.debug(`Server started listening for connections on port ${PORT}...`);
});
