import { NextFunction, Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';

import { HttpError, HttpValidationError } from '../types/http';

import * as mongo from '../db/mongodb';
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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const doc = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: doc.email },
          { $set: { email: doc.newEmail, email_verified: doc.verified } },
          { returnOriginal: false }
        );

      if (
        dbUser.value.email !== doc.newEmail &&
        dbUser.value.email_verified !== doc.verified
      ) {
        const msg = "Unable to update user's email.";
        throw new HttpError(500, msg);
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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const doc = req.body;
      doc.password = await hash(doc.password);

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: doc.email },
          { $set: { password: doc.password } },
          { returnOriginal: false }
        );

      if (dbUser.value.password !== doc.password) {
        const msg = 'Unable to change password.';
        throw new HttpError(500, msg);
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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const doc = req.body;
      doc.password = await hash(doc.password);
      doc.email_verified = false;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').insertOne(doc);

      if (dbUser.insertedCount !== 1) {
        const msg = 'Unable to create user.';
        throw new HttpError(500, msg);
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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const doc = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .deleteOne({ _id: mongo.createObjectId(doc.id) });

      if (dbUser.deletedCount !== 1) {
        const msg = 'Unable to delete user.';
        throw new HttpError(500, msg);
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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOne({ email: req.query.email });

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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const doc = req.body;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').findOne({ email: doc.email });

      if (!dbUser) {
        const msg = 'Invalid username and/or password.';
        throw new HttpError(401, msg);
      }

      const isValidPassword = await compare(doc.password, dbUser.password);

      if (!isValidPassword) {
        const msg = 'Invalid username and/or password.';
        throw new HttpError(401, msg);
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
        throw new HttpValidationError(422, msg, errors.array());
      }

      const doc = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .findOneAndUpdate(
          { email: doc.email },
          { $set: { email_verified: true } },
          { returnOriginal: false }
        );

      if (dbUser.value.email_verified !== true) {
        const msg = 'Unable to verify user.';
        throw new HttpError(500, msg);
      }

      res.send(true);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
