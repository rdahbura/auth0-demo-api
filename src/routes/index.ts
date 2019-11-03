import { NextFunction, Request, Response, Router } from 'express';

import * as pg from '../db/pg';

const router = Router();

/**
 * Root.
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { rows } = await pg.query(
        'SELECT * FROM information_schema.tables WHERE table_schema = $1;',
        ['pg_catalog']
      );
      res.send(rows);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
