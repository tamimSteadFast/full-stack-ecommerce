import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus, updateOrderStatusSchema } from '../controllers/orderController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.put('/orders/:id/status', authorize(['admin']), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
