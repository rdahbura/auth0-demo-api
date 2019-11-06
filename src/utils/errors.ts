import { NextFunction, Request, Response } from 'express';

import logger from './logger';
import { HttpError } from '../types/http';
import { IDictionary } from 'types/collections';

const replacer = (key: string, value: IDictionary): IDictionary => {
  if (value instanceof Error) {
    const err: IDictionary = {};
    Object.getOwnPropertyNames(value)
      .filter((k) => k !== 'stack')
      .forEach((k) => (err[k] = value[k]));
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
  if (err instanceof HttpError) {
    res.status(err.statusCode);
    res.json({ error: err });
    return;
  }
  res.status(500);
  res.send(JSON.stringify(err, replacer));
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(JSON.stringify(err, replacer));
  next(err);
};

export const handleNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new Error('Not Found'));
};
