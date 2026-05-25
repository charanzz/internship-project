import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import { getAllUsers, getMyProfile, createUser, updateUser, deleteUser, getRecords } from '../controllers/userController';

const router = Router();

// protect = must be logged in
// adminOnly = must be admin

router.get('/me', protect, getMyProfile);             // Any logged-in user
router.get('/records', protect, getRecords);           // Any logged-in user
router.get('/', protect, adminOnly, getAllUsers);       // Admin only
router.post('/', protect, adminOnly, createUser);      // Admin only
router.put('/:id', protect, adminOnly, updateUser);    // Admin only
router.delete('/:id', protect, adminOnly, deleteUser); // Admin only

export default router;