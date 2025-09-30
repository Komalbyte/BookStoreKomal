# Book Management API Documentation

Base URL: http://localhost:5555

---

## GET /books
- Description: Get paginated list of books with sorting
- Query params:
  - page (number, default 1)
  - limit (number, default 10, max 100)
  - sortBy (string, default createdAt)
  - sortOrder (asc|desc, default desc)
- Response 200:
```json
{
  "success": true,
  "data": {
    "books": [
      { "_id": "...", "title": "...", "author": "...", "genre": "...", "createdAt": "..." }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalBooks": 1,
      "booksPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false,
      "nextPage": null,
      "prevPage": null
    },
    "sorting": { "sortBy": "createdAt", "sortOrder": "desc" }
  }
}
```
- Errors:
  - 400 invalid page/limit
  - 500 server error

---

## GET /books/:id
- Description: Get a single book by id
- Params: id (MongoDB ObjectId)
- Response 200:
```json
{
  "success": true,
  "data": { "book": { "_id": "...", "title": "...", "author": "...", "genre": "..." } }
}
```
- Errors:
  - 400 invalid id format
  - 404 book not found
  - 500 server error

---

## POST /books/add
- Description: Create a new book
- Body (JSON):
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Genre Name",
  "publishedDate": "2024-01-01"
}
```
- Notes:
  - All fields required
  - publishedDate cannot be in the future
- Response 201:
```json
{
  "message": "Book added successfully!",
  "book": { "_id": "...", "title": "Book Title", "author": "Author Name", "genre": "Genre Name", "publishedDate": "2024-01-01" }
}
```
- Errors:
  - 400 validation failed (array of error messages)
  - 400 invalid data format
  - 500 server error

---

## PUT /books/:id
- Description: Update an existing book
- Params: id (MongoDB ObjectId)
- Body: any subset of book fields (title, author, genre, publishedDate)
- Response 200:
```json
{
  "message": "Book updated successfully",
  "data": { "book": { "_id": "...", "title": "Updated Title" } }
}
```
- Errors:
  - 400 invalid id / empty body / validation errors
  - 404 not found
  - 500 server error

---

## DELETE /books/:id
- Description: Delete a book by id
- Params: id (MongoDB ObjectId)
- Response 200:
```json
{
  "message": "Book deleted successfully",
  "data": { "deletedBook": { "id": "...", "title": "...", "author": "...", "genre": "..." } }
}
```
- Errors:
  - 400 invalid id
  - 404 not found
  - 500 server error

---

## Error Format
```json
{ "message": "...", "errors": ["..."], "details": "..." }
```

## Notes
- All responses are JSON
- Use header: Content-Type: application/json for requests with body
- Pagination defaults: page=1, limit=10
