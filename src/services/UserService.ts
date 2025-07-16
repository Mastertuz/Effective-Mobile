import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { User, CreateUserDto } from '../models/User';

export class UserService {
  private dataFile = path.join(__dirname, '../../data/users.json');
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        this.users = JSON.parse(data);
      } else {
        this.createDefaultAdmin();
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
      this.createDefaultAdmin();
    }
  }

  private saveUsers(): void {
    try {
      const dir = path.dirname(this.dataFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dataFile, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private async createDefaultAdmin(): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      id: 1,
      fullName: 'Администратор',
      birthDate: '1990-01-01',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    };
    this.users = [adminUser];
    this.saveUsers();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    if (this.users.find(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: User = {
      id: Math.max(0, ...this.users.map(u => u.id)) + 1,
      fullName: userData.fullName,
      birthDate: userData.birthDate,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      isActive: true
    };

    this.users.push(newUser);
    this.saveUsers();

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email && u.isActive);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  getUserById(id: number): User | null {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  getAllUsers(): User[] {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  blockUser(id: number): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users[userIndex].isActive = false;
    this.saveUsers();
    return true;
  }

  getUserByEmail(email: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
