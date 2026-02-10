"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/auth/register', (0, validate_1.validate)(authController_1.registerSchema), authController_1.register);
router.post('/auth/login', (0, validate_1.validate)(authController_1.loginSchema), authController_1.login);
router.get('/users/profile', authMiddleware_1.authenticate, authController_1.getProfile);
router.put('/users/profile', authMiddleware_1.authenticate, (0, validate_1.validate)(authController_1.updateProfileSchema), authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map