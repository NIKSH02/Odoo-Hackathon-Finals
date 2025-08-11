import express from 'express';
import { getCurrentUser, updateProfile, getUserById, deleteAccount } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

// Public routes
router.get('/:userId', getUserById);

export default router;
