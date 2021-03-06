import { NextFunction, Request, Response } from 'express';

import logger from './logger';
import { HttpError } from '../types/http';

const error = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status ?? 500;
  const error = Object.assign({ message: err.message }, err);

  res.status(status);
  res.json(error);
};

const errorLogger = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = Object.assign({ message: err.message }, err);
  logger.error(error);

  next(err);
};

const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new HttpError(404));
};

export { error, errorLogger, routeNotFound };
