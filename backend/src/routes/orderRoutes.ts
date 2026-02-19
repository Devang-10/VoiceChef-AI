import { Router } from 'express';
import { handleRetellWebhook, completeOrder } from '../controllers/orderController';
import { createWebCall } from '../controllers/retellController';

const router = Router();

// POST /webhooks/retell
router.post('/webhooks/retell', handleRetellWebhook);
router.patch('/orders/:id/complete', completeOrder);
router.post('/retell/create-web-call', createWebCall);

export default router;
