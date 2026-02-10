"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post('/payments', (0, validate_1.validate)(paymentController_1.processPaymentSchema), paymentController_1.processPayment);
router.get('/payments/:orderId', paymentController_1.getPaymentDetails);
router.put('/payments/:id/status', (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(paymentController_1.updatePaymentStatusSchema), paymentController_1.updatePaymentStatus);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map