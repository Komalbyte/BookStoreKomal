import express from 'express';
import Book from '../models/bookModel.js';

const router = express.Router();

// GET route to retrieve all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving books', 
      error: error.message 
    });
  }
});

// POST route to add a new book
router.post('/add', async (req, res) => {
  const { title, author, genre, publishedDate } = req.body;

  // Validate required fields
  if (!title || !author || !genre || !publishedDate) {
    return res.status(400).json({ 
      message: 'All fields (title, author, genre, publishedDate) are required' 
    });
  }

  const newBook = new Book({
    title,
    author,
    genre,
    publishedDate,
  });

  try {
    await newBook.save();
    res.status(201).json({ 
      message: 'Book added successfully!',
      book: newBook
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error adding book', 
      error: error.message 
    });
  }
});

export default router;
