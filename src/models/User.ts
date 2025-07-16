export interface User {
  id: number;
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export interface CreateUserDto {
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface LoginDto {
  email: string;
  password: string;
}
