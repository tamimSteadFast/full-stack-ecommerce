"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post('/orders', orderController_1.createOrder);
router.get('/orders', orderController_1.getOrders);
router.get('/orders/:id', orderController_1.getOrder);
router.put('/orders/:id/status', (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(orderController_1.updateOrderStatusSchema), orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map