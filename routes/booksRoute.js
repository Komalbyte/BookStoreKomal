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
  try {
    const { title, author, genre, publishedDate } = req.body;

    // Create a new book instance with the request data
    const newBook = new Book({
      title,
      author,
      genre,
      publishedDate,
    });

    // Attempt to save the new book to the database
    // Mongoose will automatically validate the data before saving
    await newBook.save();

    // Send success response
    res.status(201).json({ 
      message: 'Book added successfully!',
      book: newBook
    });
  } catch (error) {
    // Handle different types of errors
    if (error.name === 'ValidationError') {
      // Extract validation error messages
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        details: 'Please check the following fields: ' + validationErrors.join(', ')
      });
    } else if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid data format',
        error: `Invalid ${error.path}: ${error.value}`,
        details: 'Please ensure all fields are in the correct format'
      });
    } else {
      // Handle other errors (like database connection issues)
      return res.status(500).json({
        message: 'Error adding book',
        error: error.message,
        details: 'An unexpected error occurred while saving the book'
      });
    }
  }
});

export default router;
