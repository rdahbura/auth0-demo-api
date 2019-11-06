import { NextFunction, Request, Response } from 'express';

import logger from './logger';
import { HttpError } from '../types/http';
import { IDictionary } from '../types/collections';
import { NODE_ENV } from './constants';

const replacer = (key: string, value: IDictionary): IDictionary => {
  if (value instanceof Error) {
    const err: IDictionary = {};
    Object.getOwnPropertyNames(value)
      .filter((v) => NODE_ENV !== 'production' || v !== 'stack')
      .forEach((v) => (err[v] = value[v]));
    return err;
  }
  return value;
};

export const error = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  res.status(statusCode);
  res.format({
    json: () => {
      const msg = JSON.stringify({ error: err }, replacer);
      res.send(msg);
    },
  });
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const msg = JSON.stringify(err, replacer);
  logger.error(msg);
  next(err);
};

export const handleNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new HttpError(404));
};
