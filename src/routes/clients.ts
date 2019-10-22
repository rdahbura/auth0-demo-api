import { NextFunction, Request, Response, Router } from 'express';

import { getClient, getClients } from '../services/managementApi';

const router = Router();

/**
 * Retrieves a client application by its id.
 */
router.get(
  '/:id',
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
