import { Router } from 'express';
import { getShipment, createShipment, updateShipment, createShipmentSchema, updateShipmentSchema } from '../controllers/shipmentController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/shipments/:orderId', getShipment);
router.post('/shipments', authorize(['admin']), validate(createShipmentSchema), createShipment);
router.put('/shipments/:id', authorize(['admin']), validate(updateShipmentSchema), updateShipment);

export default router;
