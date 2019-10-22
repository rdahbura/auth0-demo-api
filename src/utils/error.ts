import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../types/http';

export const error404 = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new HttpError('Not Found', 404);
  next(err);
};

export const error = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
};
