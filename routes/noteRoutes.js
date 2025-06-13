import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { saveNote } from '../controllers/ui/noteControllers.js';

const router = new express.Router();

router.post('/books/:isbn/note', requireAuth, saveNote);

export default router;
