import api from './api';
import type { UserResponse } from './authService';

export interface UserUpdateDto {
  username?: string;
  email?: string;
  enabled?: boolean;
  reservationDate?: string; // LocalDate format "YYYY-MM-DD"
  // Note: Cannot change password hash per assignment requirements
}

export const adminUserService = {
  /**
   * Get all users in the system (admin only)
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>('/admin/users');
    return response.data;
  },

  /**
   * Get a specific user by ID (admin only)
   */
  async getUserById(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update a user (admin only)
   * Note: Cannot change password hash per assignment requirements
   */
  async updateUser(id: number, data: UserUpdateDto): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/admin/users/${id}`, data);
    return response.data;
  }
};
