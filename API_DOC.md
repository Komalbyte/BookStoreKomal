# Book Management API Documentation

Base URL: `http://localhost:5555`

---

## GET /books
- Description: Fetch all books with pagination and optional sorting
- Query params:
  - `page` (number, default 1)
  - `limit` (number, default 10, max 100)
  - `sortBy` (string, default `createdAt`)
  - `sortOrder` (string, `asc` or `desc`, default `desc`)
- Response: 200
```
{
  "success": true,
  "data": {
    "books": [ { "_id": "...", "title": "...", "author": "...", "genre": "...", "publishedDate": "2023-01-01T00:00:00.000Z" } ],
    "pagination": { "currentPage": 1, "totalPages": 1, "totalBooks": 1, "booksPerPage": 10, "hasNextPage": false, "hasPrevPage": false, "nextPage": null, "prevPage": null },
    "sorting": { "sortBy": "createdAt", "sortOrder": "desc" }
  }
}
```
- Errors: 400 for bad `page`/`limit`; 500 on server error

---

## GET /books/:id
- Description: Fetch a single book by MongoDB ObjectId
- Params:
  - `id` (string, 24-char hex)
- Response: 200
```
{ "success": true, "data": { "book": { "_id": "...", "title": "...", "author": "...", "genre": "...", "publishedDate": "2023-01-01T00:00:00.000Z" } } }
```
- Errors: 400 invalid ID; 404 not found; 500 server error

---

## POST /books/add
- Description: Create a new book
- Body (JSON):
```
{ "title": "Book Title", "author": "Author Name", "genre": "Fiction", "publishedDate": "2023-01-01" }
```
- Validation:
  - Required: `title`, `author`, `genre`, `publishedDate`
  - `publishedDate` cannot be in the future
  - String length constraints per model
- Responses:
  - 201
```
{ "message": "Book added successfully!", "book": { "_id": "...", "title": "Book Title", "author": "Author Name", "genre": "Fiction", "publishedDate": "2023-01-01T00:00:00.000Z" } }
```
  - 400 validation error
```
{ "message": "Validation failed", "errors": ["Title is required"], "details": "Please check the following fields: Title is required" }
```
  - 400 missing fields (manual validation)
```
{ "message": "Required fields are missing", "errors": ["title is required"] }
```

---

## PUT /books/:id
- Description: Update an existing book by ID
- Params: `id` (string)
- Body: any subset of book fields; server validates and returns updated book
- Responses:
  - 200
```
{ "message": "Book updated successfully", "data": { "book": { "_id": "...", "title": "Updated" } } }
```
  - 400 invalid ID or validation errors
  - 404 not found
  - 500 server error

---

## DELETE /books/:id
- Description: Delete a book by ID
- Responses:
  - 200
```
{ "message": "Book deleted successfully", "data": { "deletedBook": { "id": "...", "title": "...", "author": "...", "genre": "..." } } }
```
  - 400 invalid ID
  - 404 not found
  - 500 server error

---

## Error Handling
- Centralized error middleware at `app.use(errorHandler)` returns shape:
```
{ "message": "...", "stack": null | string }
```
- In production, `stack` is hidden.

---

## Notes
- Content-Type: `application/json`
- Date format: ISO-8601 strings accepted for `publishedDate`
- Base URL configurable via `PORT` and `MONGODB_URI`
