import { Router } from 'express';
import { handleRetellWebhook } from '../controllers/orderController';

const router = Router();

// POST /webhooks/retell
router.post('/webhooks/retell', handleRetellWebhook);

export default router;
