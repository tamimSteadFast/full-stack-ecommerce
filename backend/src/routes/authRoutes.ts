import { Router } from 'express';
import { register, login, getProfile, updateProfile, registerSchema, loginSchema, updateProfileSchema } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);
router.get('/users/profile', authenticate, getProfile);
router.put('/users/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
