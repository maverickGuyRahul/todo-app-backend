import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/tasks.js';
import cors from 'cors';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200'  // Allow requests from Angular app running on port 4200
}));
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api', taskRoutes); // Mount task routes under '/api' prefix

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/todo-app")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };