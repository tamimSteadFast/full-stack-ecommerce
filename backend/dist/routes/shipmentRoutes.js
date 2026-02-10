"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipmentController_1 = require("../controllers/shipmentController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/shipments/:orderId', shipmentController_1.getShipment);
router.post('/shipments', (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(shipmentController_1.createShipmentSchema), shipmentController_1.createShipment);
router.put('/shipments/:id', (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(shipmentController_1.updateShipmentSchema), shipmentController_1.updateShipment);
exports.default = router;
//# sourceMappingURL=shipmentRoutes.js.map