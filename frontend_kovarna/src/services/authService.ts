import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  reservationDate: string; // ISO date string (LocalDate)
  roles: string[]; // e.g., ["ROLE_ADMIN", "ROLE_CUSTOMER"]
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/api/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/api/auth/me');
    return response.data;
  }
};