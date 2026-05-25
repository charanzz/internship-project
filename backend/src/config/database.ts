import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // process.env reads from our .env file
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_db';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Stop the server if DB fails to connect
  }
};

export default connectDB;