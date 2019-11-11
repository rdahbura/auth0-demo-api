import { NextFunction, Request, Response } from 'express';

import logger from './logger';
import { HttpError } from '../types/http';

export function error(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status ?? 500;
  const error = Object.assign({ message: err.message }, err);

  res.status(status);
  res.json(error);
}

export function errorLogger(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(err);
  next(err);
}

export function routeNotFound(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next(new HttpError(404));
}
