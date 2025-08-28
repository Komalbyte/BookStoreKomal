import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to MERN Backend');
});

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/bookstore';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err.message);
    console.log('Server will start without database connection for testing purposes');
  });

// Start server regardless of database connection
app.listen(5555, () => {
  console.log('Server is running on port 5555');
});

export default app;
