import express from 'express';
import { getBooks, getBookById, addBook, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

// GET route to retrieve all books with pagination
router.get('/', getBooks);

// GET route to fetch a single book by ID
router.get('/:id', getBookById);

// POST route to add a new book
router.post('/add', addBook);

export default router;

// PUT route to update an existing book by ID
router.put('/:id', updateBook);

// DELETE route to remove a book by ID
router.delete('/:id', deleteBook);
