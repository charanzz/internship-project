import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// GET /api/users/me
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

// GET /api/users — Admin only
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = await User.find({}).select('-password');
    res.json({ users, total: users.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/users — Admin creates user
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

// PUT /api/users/:id — Admin updates user
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
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

// DELETE /api/users/:id — Admin deletes user
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

// GET /api/users/records — Role-based record access
export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Artificial delay demonstrates async processing with skeleton loader
    await new Promise(resolve => setTimeout(resolve, 1500));

    const allRecords = [
      {
        id: 1, title: 'Project Alpha', status: 'Active',
        priority: 'High', assignee: 'Alice',
        date: '2024-01-15', accessLevel: 'all',
        description: 'Frontend redesign initiative'
      },
      {
        id: 2, title: 'Project Beta', status: 'Pending',
        priority: 'Medium', assignee: 'Bob',
        date: '2024-01-18', accessLevel: 'all',
        description: 'API integration module'
      },
      {
        id: 3, title: 'Project Gamma', status: 'Completed',
        priority: 'Low', assignee: 'Charlie',
        date: '2024-01-20', accessLevel: 'all',
        description: 'Database migration task'
      },
      {
        id: 4, title: 'Project Delta', status: 'Active',
        priority: 'High', assignee: 'Diana',
        date: '2024-01-22', accessLevel: 'all',
        description: 'Mobile app development'
      },
      {
        id: 5, title: 'Project Epsilon', status: 'Pending',
        priority: 'Medium', assignee: 'Eve',
        date: '2024-01-25', accessLevel: 'all',
        description: 'Security audit module'
      },
      {
        id: 6, title: 'Admin Report Q1', status: 'Active',
        priority: 'High', assignee: 'Admin',
        date: '2024-02-01', accessLevel: 'admin',
        description: 'Quarterly performance review'
      },
      {
        id: 7, title: 'Admin Report Q2', status: 'Pending',
        priority: 'High', assignee: 'Admin',
        date: '2024-02-10', accessLevel: 'admin',
        description: 'Budget allocation report'
      },
      {
        id: 8, title: 'System Config', status: 'Active',
        priority: 'High', assignee: 'Admin',
        date: '2024-02-15', accessLevel: 'admin',
        description: 'Infrastructure configuration'
      },
    ];

    const userRole = req.user?.role;

    // Admins see ALL records — general users see only 'all' access records
    const records = userRole === 'admin'
      ? allRecords
      : allRecords.filter(r => r.accessLevel === 'all');

    res.json({
      records,
      total: records.length,
      accessLevel: userRole === 'admin' ? 'full' : 'general',
      message: userRole === 'admin'
        ? 'Admin access: showing all records including restricted'
        : 'General access: showing permitted records only'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};