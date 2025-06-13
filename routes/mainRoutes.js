import express from 'express';
import { renderIndexPage, renderAddBookPage, deleteBook } from '../controllers/ui/bookControllers.js';
import { requireAdmin } from '../middleware/isAdmin.js';

const router = new express.Router();

router.get('/', renderIndexPage);
router.get('/add-book', renderAddBookPage);
router.post('/books/:isbn/delete', requireAdmin, deleteBook);

export default router;
