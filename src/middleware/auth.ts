import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserService } from '../services/UserService';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'admin' | 'user';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

export const checkUserAccess = (userService: UserService) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);
    
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied.' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.id === userId) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied. You can only access your own data.' });
  };
};
