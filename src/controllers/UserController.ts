import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { JWT_SECRET } from '../config';
import { CreateUserDto, LoginDto } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;

      if (!userData.fullName || !userData.birthDate || !userData.email || !userData.password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const user = await this.userService.createUser(userData);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDto = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = await this.userService.validateUser(email, password);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ message: 'Login successful', token, user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const user = this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = this.userService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async blockUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const success = this.userService.blockUser(userId);
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ message: 'User blocked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
