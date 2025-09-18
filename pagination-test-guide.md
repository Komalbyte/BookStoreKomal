# Day 6: Enhanced GET Route with Pagination - Testing Guide

## 🧪 Pagination Test Results

### ✅ Test 1: Default Pagination
**Request:** `GET /books`
**Response:** 200 - Success with default pagination
```json
{
  "success": true,
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalBooks": 4,
      "booksPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false,
      "nextPage": null,
      "prevPage": null
    },
    "sorting": {
      "sortBy": "createdAt",
      "sortOrder": "desc"
    }
  }
}
```

### ✅ Test 2: Custom Limit
**Request:** `GET /books?limit=2`
**Response:** 200 - Success with 2 books per page
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalBooks": 4,
    "booksPerPage": 2,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

### ✅ Test 3: Page Navigation
**Request:** `GET /books?page=2&limit=2`
**Response:** 200 - Success with page 2
```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 2,
    "totalBooks": 4,
    "booksPerPage": 2,
    "hasNextPage": false,
    "hasPrevPage": true,
    "nextPage": null,
    "prevPage": 1
  }
}
```

### ✅ Test 4: Sorting by Title
**Request:** `GET /books?sortBy=title&sortOrder=asc&limit=3`
**Response:** 200 - Success with sorted results
```json
{
  "data": {
    "books": [
      {"title": "1984"},
      {"title": "Pride and Prejudice"},
      {"title": "The Great Gatsby"}
    ],
    "sorting": {
      "sortBy": "title",
      "sortOrder": "asc"
    }
  }
}
```

### ✅ Test 5: Invalid Limit Validation
**Request:** `GET /books?limit=150`
**Response:** 400 - Validation Error
```json
{
  "message": "Limit must be between 1 and 100",
  "error": "Invalid limit parameter"
}
```

## 🎯 Enhanced GET Route Features

### Query Parameters:
- **page** (optional): Page number (default: 1)
- **limit** (optional): Books per page (default: 10, max: 100)
- **sortBy** (optional): Field to sort by (default: 'createdAt')
- **sortOrder** (optional): 'asc' or 'desc' (default: 'desc')

### Response Structure:
```json
{
  "success": true,
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBooks": 50,
      "booksPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null
    },
    "sorting": {
      "sortBy": "createdAt",
      "sortOrder": "desc"
    }
  }
}
```

### Validation Rules:
- **Page:** Must be ≥ 1
- **Limit:** Must be between 1 and 100
- **SortBy:** Any valid field name
- **SortOrder:** 'asc' or 'desc'

## 🚀 API Endpoints

- **GET** `/books` - Get all books with pagination
- **GET** `/books?page=2&limit=5` - Get page 2 with 5 books
- **GET** `/books?sortBy=title&sortOrder=asc` - Sort by title ascending
- **POST** `/books/add` - Add new book with validation

## 📋 Testing Commands

```bash
# Default pagination
curl "http://localhost:5555/books"

# Custom pagination
curl "http://localhost:5555/books?page=2&limit=3"

# Sorting
curl "http://localhost:5555/books?sortBy=title&sortOrder=asc"

# Invalid parameters
curl "http://localhost:5555/books?limit=150"
curl "http://localhost:5555/books?page=0"
```

## 🎉 Benefits of Pagination

1. **Performance:** Limits data transfer and processing
2. **User Experience:** Easier navigation through large datasets
3. **Scalability:** Handles growing data efficiently
4. **Flexibility:** Customizable page sizes and sorting
5. **Metadata:** Rich pagination information for frontend
