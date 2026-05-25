export interface User {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Record {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  date: string;
}