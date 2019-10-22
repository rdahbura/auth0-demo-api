import { NextFunction, Request, Response, Router } from 'express';

import { getUser, getUsers } from '../services/managementApi';

const router = Router();

/**
 * Retrieves a user by its id.
 */
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getUser(req.params.id, req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Retrieves a list of all users
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getUsers(req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
