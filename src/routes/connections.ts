import { NextFunction, Request, Response, Router } from 'express';
import jwtAuthz from 'express-jwt-authz';

import { getConnection, getConnections } from '../services/management';

const router = Router();
const options = { customScopeKey: 'permissions' };

/**
 * Retrieves a list of all client applications
 */
router.get(
  '/',
  jwtAuthz(['read:connections'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getConnections(req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Retrieves a client application by its id.
 */
router.get(
  '/:id',
  jwtAuthz(['read:connections'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getConnection(req.params.id, req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
