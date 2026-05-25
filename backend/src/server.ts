// This is the entry point — it starts everything
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables from .env file FIRST
dotenv.config();

// Connect to MongoDB
connectDB();

// Create the Express app
const app = express();

// Middleware — these run on EVERY request before hitting your routes
app.use(cors({
  origin: 'http://localhost:4200',  // Only allow requests from Angular dev server
  credentials: true,
}));

app.use(express.json());  // Parse incoming JSON request bodies

// Health check endpoint — useful for testing the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

// Mount routes — all auth routes start with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});