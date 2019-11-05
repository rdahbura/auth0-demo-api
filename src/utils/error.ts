import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../types/http';

export const error404 = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new HttpError(404, 'Not Found');
  next(err);
};

export const error = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.statusCode ?? 500);
  res.json(err);
};
