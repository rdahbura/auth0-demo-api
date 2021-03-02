import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import * as mongo from '../db/mongodb';
import { HttpError } from '../types/http';
import { hashCompare } from '../utils/security';

const router = Router();

/**
 * Create a login.
 */
router.post(
  '/logins',
  [body('email').isEmail(), body('password').not().isEmpty()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { email, password } = req.body;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').findOne({ email: email });

      if (!dbUser) {
        const msg = 'Invalid username and/or password.';
        const error = new HttpError(401, msg);
        return next(error);
      }

      const isValidPassword = await hashCompare(password, dbUser.password);

      if (!isValidPassword) {
        const msg = 'Invalid username and/or password.';
        const error = new HttpError(401, msg);
        return next(error);
      }

      delete dbUser.password;

      res.send(dbUser);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
