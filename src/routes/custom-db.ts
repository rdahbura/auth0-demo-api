import { NextFunction, Request, Response, Router } from 'express';
import { HttpError } from '../types/http';

import * as mongo from '../db/mongodb';
import { compare, hash } from '../utils/security';

const router = Router();

/**
 * Change the email associated with the user.
 */
router.patch(
  '/change-email',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
        throw new HttpError("Unable to update user's email.", 500);
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
        throw new HttpError('Unable to change password.', 500);
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = req.body;
      doc.password = await hash(doc.password);
      doc.email_verified = false;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').insertOne(doc);

      if (dbUser.insertedCount !== 1) {
        throw new HttpError('Unable to create user.', 500);
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = req.body;

      const db = await mongo.connect();
      const dbUser = await db
        .collection('users')
        .deleteOne({ _id: mongo.createObjectId(doc.id) });

      if (dbUser.deletedCount !== 1) {
        throw new HttpError('Unable to delete user.', 500);
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = req.body;

      const db = await mongo.connect();
      const dbUser = await db.collection('users').findOne({ email: doc.email });

      if (!dbUser) {
        throw new HttpError('Invalid username and/or password.', 401);
      }

      const isValidPassword = await compare(doc.password, dbUser.password);

      if (!isValidPassword) {
        throw new HttpError('Invalid username and/or password.', 401);
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
        throw new HttpError('Unable to verify user.', 500);
      }

      res.send(true);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
