import express from 'express';
import mongoose from 'mongoose';
import Book from '../models/bookModel.js';

const router = express.Router();

// GET route to retrieve all books with pagination
router.get('/', async (req, res) => {
  try {
    // Get query parameters with defaults
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Validate pagination parameters
    if (page < 1 || isNaN(page)) {
      return res.status(400).json({
        message: 'Page number must be greater than 0',
        error: 'Invalid page parameter'
      });
    }

    if (limit < 1 || limit > 100 || isNaN(limit)) {
      return res.status(400).json({
        message: 'Limit must be between 1 and 100',
        error: 'Invalid limit parameter'
      });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Fetch books with pagination and sorting
    const books = await Book.find({})
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v'); // Exclude version field

    // Count total number of books
    const totalBooks = await Book.countDocuments();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalBooks / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Send response with books and pagination data
    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalBooks: totalBooks,
          booksPerPage: limit,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        sorting: {
          sortBy: sortBy,
          sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving books', 
      error: error.message,
      details: 'An unexpected error occurred while fetching books'
    });
  }
});

// GET route to fetch a single book by ID
router.get('/:id', async (req, res) => {
  try {
    // Extract the ID from the route parameter
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid book ID format',
        error: 'The provided ID is not a valid MongoDB ObjectId',
        details: 'Book ID must be a 24-character hexadecimal string'
      });
    }

    // Fetch the book by ID from the database
    const book = await Book.findById(id).select('-__v'); // Exclude version field

    // If book is not found, return a 404 response
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found',
        error: `No book found with ID: ${id}`,
        details: 'Please check the book ID and try again'
      });
    }

    // Return the book in the response
    res.status(200).json({
      success: true,
      data: {
        book: book
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching book', 
      error: error.message,
      details: 'An unexpected error occurred while fetching the book'
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
