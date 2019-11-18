import { NextFunction, Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';

import * as mongo from '../db/mongodb';
import { HttpError } from '../types/http';
import { compare, hash } from '../utils/security';

const router = Router();

/**
 * Change the email associated with the user.
 */
router.patch(
  '/users/:email/email',
  [
    param('email').isEmail(),
    body('newEmail').isEmail(),
    body('verified').isBoolean(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { email } = req.params;
      const { newEmail, verified } = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: email },
          { $set: { email: newEmail, email_verified: verified } },
          { returnOriginal: false }
        );

      if (
        dbUser.value.email !== newEmail &&
        dbUser.value.email_verified !== verified
      ) {
        const msg = "Unable to update user's email.";
        const error = new HttpError(500, msg);
        return next(error);
      }

      res.send(true);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Change the password associated with the user.
 */
router.patch(
  '/users/:email/password',
  [
    param('email').isEmail(),
    body('password')
      .not()
      .isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { email } = req.params;
      const { password } = req.body;
      const passwordHash = await hash(password);

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: email },
          { $set: { password: passwordHash } },
          { returnOriginal: false }
        );

      if (dbUser.value.password !== passwordHash) {
        const msg = 'Unable to change password.';
        const error = new HttpError(500, msg);
        return next(error);
      }

      res.send(true);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Create a user.
 */
router.post(
  '/users',
  [
    body('email').isEmail(),
    body('password')
      .not()
      .isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;
      body.email_verified = body.email_verified ?? false;
      body.password = await hash(body.password);

      const db = await mongo.connect();
      const dbUser = await db.collection('users').insertOne(body);

      if (dbUser.insertedCount !== 1) {
        const msg = 'Unable to create user.';
        const error = new HttpError(500, msg);
        return next(error);
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Delete a user.
 */
router.delete(
  '/users/:id',
  [param('id').isMongoId()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { id } = req.params;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .deleteOne({ _id: mongo.createObjectId(id) });

      if (dbUser.deletedCount !== 1) {
        const msg = 'Unable to delete user.';
        const error = new HttpError(500, msg);
        return next(error);
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Gets a user.
 */
router.get(
  '/users/:email',
  [param('email').isEmail()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { email } = req.params;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').findOne({ email: email });

      dbUser && delete dbUser.password;

      res.send(dbUser);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Authenticates a user.
 */
router.post(
  '/users/:email/login',
  [
    param('email').isEmail(),
    body('password')
      .not()
      .isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { email } = req.params;
      const { password } = req.body;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').findOne({ email: email });

      if (!dbUser) {
        const msg = 'Invalid username and/or password.';
        const error = new HttpError(401, msg);
        return next(error);
      }

      const isValidPassword = await compare(password, dbUser.password);

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

/**
 * Mark the verification status of a user’s email address.
 */
router.patch(
  '/users/:email/verify',
  [param('email').isEmail()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpError(422, msg, errors.array());
        return next(error);
      }

      const { email } = req.params;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: email },
          { $set: { email_verified: true } },
          { returnOriginal: false }
        );

      if (dbUser.value.email_verified !== true) {
        const msg = 'Unable to verify user.';
        const error = new HttpError(500, msg);
        return next(error);
      }

      res.send(true);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
