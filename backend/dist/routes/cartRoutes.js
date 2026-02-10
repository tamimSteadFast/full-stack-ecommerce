"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate); // All cart routes require auth
router.get('/cart', cartController_1.getCart);
router.post('/cart/items', (0, validate_1.validate)(cartController_1.addToCartSchema), cartController_1.addToCart);
router.put('/cart/items/:id', (0, validate_1.validate)(cartController_1.updateCartItemSchema), cartController_1.updateCartItem);
router.delete('/cart/items/:id', cartController_1.removeCartItem);
router.delete('/cart', cartController_1.clearCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map