# Postman Testing Guide for Day 3

## Testing the POST Route

### 1. Add a New Book
**Method:** POST  
**URL:** `http://localhost:5555/books/add`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "publishedDate": "1925-04-10"
}
```

### 2. Test Validation (Missing Fields)
**Method:** POST  
**URL:** `http://localhost:5555/books/add`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald"
}
```
**Expected Response:** 400 Bad Request with validation error message

### 3. Get All Books
**Method:** GET  
**URL:** `http://localhost:5555/books`  
**Expected Response:** Array of all books in the database

## Test Data Examples

### Example 1: Classic Fiction
```json
{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "genre": "Fiction",
  "publishedDate": "1960-07-11"
}
```

### Example 2: Science Fiction
```json
{
  "title": "Dune",
  "author": "Frank Herbert",
  "genre": "Science Fiction",
  "publishedDate": "1965-08-01"
}
```

### Example 3: Non-Fiction
```json
{
  "title": "The Art of War",
  "author": "Sun Tzu",
  "genre": "Non-Fiction",
  "publishedDate": "-0500-01-01"
}
```

## Notes
- Make sure your server is running on port 5555
- MongoDB connection is optional for testing validation
- The route will return appropriate error messages for validation failures



