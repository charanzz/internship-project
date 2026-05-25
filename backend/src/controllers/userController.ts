import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// GET /api/users — Get all users (admin only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Simulate loading delay for demonstrating async behavior
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // .find({}) gets all documents. .select('-password') hides the password field
    const users = await User.find({}).select('-password');
    
    res.json({ users, total: users.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/me — Get the currently logged-in user's profile
export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ userId: req.user?.userId }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/users — Admin creates a new user
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, password, role, name, email } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'User ID or email already exists' });
      return;
    }

    const user = new User({ userId, password, role, name, email });
    await user.save();
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { userId: user.userId, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/:id — Admin updates a user
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, role, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }   // new:true returns the updated document
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/users/:id — Admin deletes a user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/records — Fetch dashboard records (simulated data with delay)
export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Artificial delay — demonstrates async loading in frontend
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Dummy records data — in a real app this comes from a database
    const records = [
      { id: 1, title: 'Project Alpha', status: 'Active', priority: 'High', assignee: 'Alice', date: '2024-01-15' },
      { id: 2, title: 'Project Beta',  status: 'Pending', priority: 'Medium', assignee: 'Bob', date: '2024-01-18' },
      { id: 3, title: 'Project Gamma', status: 'Completed', priority: 'Low', assignee: 'Charlie', date: '2024-01-20' },
      { id: 4, title: 'Project Delta', status: 'Active', priority: 'High', assignee: 'Diana', date: '2024-01-22' },
      { id: 5, title: 'Project Epsilon', status: 'Pending', priority: 'Medium', assignee: 'Eve', date: '2024-01-25' },
    ];

    res.json({ records, total: records.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};