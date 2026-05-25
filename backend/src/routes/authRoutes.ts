// Routes connect URL paths to controller functions
import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// POST /api/auth/register → calls the register function
router.post('/register', register);

// POST /api/auth/login → calls the login function
router.post('/login', login);

export default router;