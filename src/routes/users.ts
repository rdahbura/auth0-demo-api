import { NextFunction, Request, Response, Router } from 'express';
import jwtAuthz from 'express-jwt-authz';

import { enableMfa, getUser, getUsers } from '../services/managementApi';

const router = Router();
const options = { customScopeKey: 'permissions' };

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
 * Enable / disable MFA
 */
router.patch(
  '/:id/enable-mfa/:value',
  jwtAuthz(['update:users'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await enableMfa(req.params.id, req.params.value);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
