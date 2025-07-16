import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { authenticate, requireAdmin, checkUserAccess } from '../middleware/auth';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));

router.get('/users/:id', authenticate, checkUserAccess(userService), (req, res) => 
  userController.getUserById(req, res)
);

router.get('/users', authenticate, requireAdmin, (req, res) => 
  userController.getAllUsers(req, res)
);

router.patch('/users/:id/block', authenticate, checkUserAccess(userService), (req, res) => 
  userController.blockUser(req, res)
);

export default router;
