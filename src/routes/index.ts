import { NextFunction, Request, Response, Router } from 'express';

import * as pg from '../db/postgresql';

import clientsRouter from './clients';
import databaseRouter from './databases';
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
router.use('/databases', databaseRouter);
router.use('/users', usersRouter);

export default router;
