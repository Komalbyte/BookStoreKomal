import mongoose from 'mongoose';
import Book from '../models/bookModel.js';

// GET: fetch all books with pagination and sorting
export const getBooks = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

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

    const skip = (page - 1) * limit;
    const sort = {}; sort[sortBy] = sortOrder;

    const books = await Book.find({})
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks,
          booksPerPage: limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        sorting: {
          sortBy,
          sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books',
      error: error.message,
      details: 'An unexpected error occurred while fetching books'
    });
  }
};

// GET: fetch a single book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid book ID format',
        error: 'The provided ID is not a valid MongoDB ObjectId',
        details: 'Book ID must be a 24-character hexadecimal string'
      });
    }

    const book = await Book.findById(id).select('-__v');
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        error: `No book found with ID: ${id}`,
        details: 'Please check the book ID and try again'
      });
    }

    return res.status(200).json({ success: true, data: { book } });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching book',
      error: error.message,
      details: 'An unexpected error occurred while fetching the book'
    });
  }
};

// POST: add a new book
export const addBook = async (req, res, next) => {
  const { title, author, genre, publishedDate } = req.body || {};

  // Manual basic validation before hitting Mongoose
  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!author) missingFields.push('author');
  if (!genre) missingFields.push('genre');
  if (!publishedDate) missingFields.push('publishedDate');
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Required fields are missing',
      errors: missingFields.map(f => `${f} is required`)
    });
  }

  try {
    const newBook = new Book({ title, author, genre, publishedDate });
    await newBook.save();
    return res.status(201).json({ message: 'Book added successfully!', book: newBook });
  } catch (error) {
    if (error.name === 'ValidationError') {
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
    }
    // Defer unexpected errors to centralized error handler
    return next(error);
  }
};

// PUT: update an existing book by ID
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid book ID',
        error: 'The provided ID is not a valid MongoDB ObjectId'
      });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'No update data provided',
        error: 'Request body cannot be empty'
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    ).select('-__v');

    if (!updatedBook) {
      return res.status(404).json({
        message: 'Book not found',
        error: `No book found with ID: ${id}`
      });
    }

    return res.status(200).json({ message: 'Book updated successfully', data: { book: updatedBook } });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }
    return res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// DELETE: remove a book by ID
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid book ID',
        error: 'The provided ID is not a valid MongoDB ObjectId',
        details: 'Book ID must be a 24-character hexadecimal string'
      });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({
        message: 'Book not found',
        error: `No book found with ID: ${id}`,
        details: 'Please check the book ID and try again'
      });
    }

    return res.status(200).json({
      message: 'Book deleted successfully',
      data: { deletedBook: { id: deletedBook._id, title: deletedBook.title, author: deletedBook.author, genre: deletedBook.genre } }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting book', error: error.message, details: 'An unexpected error occurred while deleting the book' });
  }
};


