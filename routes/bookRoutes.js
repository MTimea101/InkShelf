import express from 'express';
import { getBooks, getBookByISBN, createBook, deleteBook } from '../controllers/api/bookControllers.js';

const router = new express.Router();

// get books
router.get('/', getBooks);

// get book details by ISBN
router.get('/:isbn', getBookByISBN);

// add book
router.post('/', createBook);

// book delete by ISBN
router.delete('/:isbn', deleteBook);

export default router;
