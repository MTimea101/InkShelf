import express from 'express';
import { addReview, deleteReview } from '../controllers/ui/reviewControllers.js';
import { requireAuth } from '../middleware/auth.js';

const router = new express.Router();

router.post('/books/:isbn/review', requireAuth, addReview);
router.post('/books/:isbn/review/delete', requireAuth, deleteReview);

export default router;
