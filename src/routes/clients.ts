import { NextFunction, Request, Response, Router } from 'express';
import jwtAuthz from 'express-jwt-authz';

import { getClient, getClients } from '../services/management';

const router = Router();
const options = { customScopeKey: 'permissions' };

/**
 * Retrieves a client application by its id.
 */
router.get(
  '/:id',
  jwtAuthz(['read:clients'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getClient(req.params.id, req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Retrieves a list of all client applications
 */
router.get(
  '/',
  jwtAuthz(['read:clients'], options),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = await getClients(req.query);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
