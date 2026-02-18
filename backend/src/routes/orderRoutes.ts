import { Router } from 'express';
import { handleRetellWebhook, completeOrder } from '../controllers/orderController';

const router = Router();

// POST /webhooks/retell
router.post('/webhooks/retell', handleRetellWebhook);
router.patch('/orders/:id/complete', completeOrder);

export default router;
