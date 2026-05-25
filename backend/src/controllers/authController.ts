// Controllers contain the actual logic for each API endpoint
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Helper to create a JWT token for a user
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }   // ← hardcoded string literal, TypeScript is happy
  );
};

// POST /api/auth/register — Create a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, role, name, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'User ID or email already exists' });
      return;
    }

    // Create the user (password will be hashed automatically by our model hook)
    const user = new User({ userId, password, role, name, email });
    await user.save();

    // Generate a token immediately so they're "logged in" after registering
    const token = generateToken(user.userId, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/login — Log in with userId + password
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, role } = req.body;

    // Find user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      // Use vague message for security — don't reveal if userId exists or not
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if the role matches
    if (user.role !== role) {
      res.status(401).json({ message: 'Invalid role for this account' });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(403).json({ message: 'Account is deactivated' });
      return;
    }

    // Compare the entered password with the hashed one in DB
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.userId, user.role);

    // Add artificial delay to simulate real-world async behavior
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};