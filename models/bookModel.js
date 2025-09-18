import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minLength: [1, 'Title must be at least 1 character long'],
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    minLength: [1, 'Author name must be at least 1 character long'],
    maxLength: [100, 'Author name cannot exceed 100 characters'],
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    minLength: [1, 'Genre must be at least 1 character long'],
    maxLength: [50, 'Genre cannot exceed 50 characters'],
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required'],
    validate: {
      validator: function(date) {
        // Check if date is not in the future
        return date <= new Date();
      },
      message: 'Published date cannot be in the future'
    }
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Book = mongoose.model('Book', bookSchema);

export default Book;

