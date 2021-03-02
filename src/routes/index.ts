import { NextFunction, Request, Response, Router } from 'express';

import * as pg from '../db/postgresql';

import clientsRouter from './clients';
import connectionsRouter from './connections';
import databaseRouter from './databases';
import loginsRouter from './logins';
import usersRouter from './users';

const router = Router();

/**
 * Root.
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        rows,
      } = await pg.query(
        'SELECT * FROM information_schema.tables WHERE table_schema = $1;',
        ['pg_catalog']
      );
      res.send(rows);
    } catch (err) {
      next(err);
    }
  }
);

router.use('/clients', clientsRouter);
router.use('/connections', connectionsRouter);
router.use('/databases', databaseRouter);
router.use('/logins', loginsRouter);
router.use('/users', usersRouter);

export default router;
