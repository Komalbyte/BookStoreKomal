# BookStore Backend

A Node.js/Express backend API for managing a book collection with MongoDB integration.

## Features

- Express.js server setup
- MongoDB connection using Mongoose
- CORS enabled for cross-origin requests
- Basic GET route implementation
- Organized project structure for scalability

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5555.

## Testing

Test the server endpoint:
```bash
curl http://localhost:5555
```

Expected response: `Welcome to MERN Backend`

## API Endpoints

- `GET /` - Welcome message

## Database Connection

The application connects to MongoDB at `mongodb://localhost:27017/bookstore`.

To use MongoDB Atlas, update the `MONGODB_URI` in `index.js` with your connection string.

## Project Structure

```
BookStore/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
├── README.md         # Project documentation
├── .gitignore        # Git ignore rules
├── test-server.js    # Server test script
├── models/           # Mongoose models
├── routes/           # API routes
├── controllers/      # Route controllers
└── config/           # Configuration files
```

## Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling tool
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development server with auto-restart

## Next Steps

- Create Book model with Mongoose
- Implement CRUD operations for books
- Add validation and error handling
- Set up environment variables
- Add authentication and authorization

## Environment Setup

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb://localhost:27017/bookstore
```

For MongoDB Atlas, use your connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/bookstore?retryWrites=true&w=majority
```
