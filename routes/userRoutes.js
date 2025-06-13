import express from 'express';
import { requireRole } from '../middleware/role.js';
import {
  updateUserRole,
  deleteUser,
  addToWishlist,
  renderWishlist,
  removeFromWishlist,
} from '../controllers/api/userControllers.js';
import { renderProfilePage, updateProfile, updatePassword } from '../controllers/ui/userControllers.js';
import { requireAuth } from '../middleware/auth.js';

const router = new express.Router();

// API routes (admin functions)
router.post('/users/:id/role', requireRole('admin'), updateUserRole);
router.post('/users/:id/delete', requireRole('admin'), deleteUser);

// Wishlist functions
router.post('/wishlist/:isbn', requireAuth, addToWishlist);
router.get('/wishlist', requireAuth, renderWishlist);
router.post('/wishlist/:isbn/delete', requireAuth, removeFromWishlist);

// Profile functions
router.get('/profile', requireAuth, renderProfilePage);
router.post('/profile/update', requireAuth, updateProfile);
router.post('/profile/update-password', requireAuth, updatePassword);

export default router;
