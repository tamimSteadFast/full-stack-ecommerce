import { Router } from 'express';
import { processPayment, getPaymentDetails, updatePaymentStatus, processPaymentSchema, updatePaymentStatusSchema } from '../controllers/paymentController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/payments', validate(processPaymentSchema), processPayment);
router.get('/payments/:orderId', getPaymentDetails);
router.put('/payments/:id/status', authorize(['admin']), validate(updatePaymentStatusSchema), updatePaymentStatus);

export default router;
