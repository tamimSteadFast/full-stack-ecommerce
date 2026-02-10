"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const inventoryController_1 = require("../controllers/inventoryController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Products
router.get('/products', productController_1.listProducts);
router.get('/products/:id', productController_1.getProduct);
router.post('/products', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(productController_1.createProductSchema), productController_1.createProduct);
router.put('/products/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(productController_1.updateProductSchema), productController_1.updateProduct);
router.delete('/products/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['admin']), productController_1.deleteProduct);
// Variants
router.get('/products/:id/variants', productController_1.getProductVariants);
// Inventory
router.get('/inventory/:variantId', inventoryController_1.checkStock);
router.put('/inventory/:variantId', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['admin']), (0, validate_1.validate)(inventoryController_1.updateInventorySchema), inventoryController_1.updateInventory);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map