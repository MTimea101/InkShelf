import express from 'express';
import { renderBookDetails, handleBorrowAction, renderMyBorrows } from '../controllers/ui/borrowControllers.js';
import { deleteBorrow } from '../controllers/api/borrowControllers.js';
import { requireAuth } from '../middleware/auth.js';
import { addReview } from '../controllers/ui/reviewControllers.js';

const router = new express.Router();

router.get('/books/:isbn', renderBookDetails);
router.post('/books/:isbn/action', handleBorrowAction);

router.delete('/api/borrows/:borrowId', deleteBorrow);

router.get('/my-borrows', requireAuth, renderMyBorrows);
router.post('/books/:isbn/review', addReview);

export default router;
