import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend Express's Request type to include our custom 'user' property
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// This middleware verifies the JWT and attaches user info to the request
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // The token comes in the HTTP header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  // Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify checks the signature AND decodes the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = { userId: decoded.userId, role: decoded.role };
    next(); // Move to the next handler (the controller)
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// This middleware checks if the logged-in user has the 'admin' role
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};