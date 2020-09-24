import { NextFunction, Request, Response, Router } from 'express';
import jwtAuthz from 'express-jwt-authz';

import { getUser, getUsers, updateUser } from '../services/management';

const router = Router();
const options = { customScopeKey: 'permissions' };

/**
 * Retrieves a list of all users
 */
router.get(
  '/',
  jwtAuthz(['read:users'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getUsers(req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Retrieves a user by its id.
 */
router.get(
  '/:id',
  jwtAuthz(['read:users'], options),
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
 * Updates a user
 */
router.patch(
  '/:id',
  jwtAuthz(['update:users'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await updateUser(req.params.id, req.body);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
