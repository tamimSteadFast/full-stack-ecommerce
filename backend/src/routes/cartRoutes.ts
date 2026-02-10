import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, addToCartSchema, updateCartItemSchema } from '../controllers/cartController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate); // All cart routes require auth

router.get('/cart', getCart);
router.post('/cart/items', validate(addToCartSchema), addToCart);
router.put('/cart/items/:id', validate(updateCartItemSchema), updateCartItem);
router.delete('/cart/items/:id', removeCartItem);
router.delete('/cart', clearCart);

export default router;
