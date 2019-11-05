import { NextFunction, Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';

import * as mongo from '../db/mongodb';
import { HttpError, HttpValidationError } from '../types/http';
import { compare, hash } from '../utils/security';

const router = Router();

/**
 * Change the email associated with the user.
 */
router.patch(
  '/change-email',
  [
    check('email').isEmail(),
    check('newEmail').isEmail(),
    check('verified').isBoolean(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: body.email },
          { $set: { email: body.newEmail, email_verified: body.verified } },
          { returnOriginal: false }
        );

      if (
        dbUser.value.email !== body.newEmail &&
        dbUser.value.email_verified !== body.verified
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
  '/change-password',
  [
    check('email').isEmail(),
    check('password')
      .not()
      .isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;
      body.password = await hash(body.password);

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: body.email },
          { $set: { password: body.password } },
          { returnOriginal: false }
        );

      if (dbUser.value.password !== body.password) {
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
  '/create',
  [
    check('email').isEmail(),
    check('email_verified')
      .not()
      .isEmpty(),
    check('password')
      .not()
      .isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;
      body.password = await hash(body.password);
      body.email_verified = false;

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
  '/delete',
  [check('id').isMongoId()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .deleteOne({ _id: mongo.createObjectId(body.id) });

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
  '/get-user',
  [check('email').isEmail()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const query = req.query;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOne({ email: query.email });

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
  '/login',
  [
    check('email').isEmail(),
    check('password')
      .not()
      .isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOne({ email: body.email });

      if (!dbUser) {
        const msg = 'Invalid username and/or password.';
        const error = new HttpError(401, msg);
        return next(error);
      }

      const isValidPassword = await compare(body.password, dbUser.password);

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
  '/verify',
  [check('email').isEmail()],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = 'Request failed validation.';
        const error = new HttpValidationError(422, msg, errors.array());
        return next(error);
      }

      const body = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: body.email },
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
