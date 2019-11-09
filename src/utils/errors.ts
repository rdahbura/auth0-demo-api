import { NextFunction, Request, Response } from 'express';

import logger from './logger';
import { HttpError } from '../types/http';

export const error = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const error = { message: err.message };
  Object.assign(error, err);

  res.status(statusCode);
  res.json({ error: error });
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err);
  next(err);
};

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new HttpError(404));
};
