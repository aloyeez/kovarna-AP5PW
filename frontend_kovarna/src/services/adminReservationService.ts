import api from './api';
import type { ReservationResponse } from './reservationService';

export interface ReservationUpdateDto {
  slotId?: number;
  date?: string; // LocalDate format "YYYY-MM-DD"
  guestCount?: number;
  status?: string; // "ACTIVE", "CANCELLED", etc.
}

export const adminReservationService = {
  /**
   * Get all reservations in the system (admin only)
   */
  async getAllReservations(): Promise<ReservationResponse[]> {
    const response = await api.get<ReservationResponse[]>('/admin/reservations');
    return response.data;
  },

  /**
   * Get a specific reservation by ID (admin only)
   */
  async getReservationById(id: number): Promise<ReservationResponse> {
    const response = await api.get<ReservationResponse>(`/admin/reservations/${id}`);
    return response.data;
  },

  /**
   * Update a reservation (admin only)
   * Note: Cannot change password hash per assignment requirements
   */
  async updateReservation(id: number, data: ReservationUpdateDto): Promise<ReservationResponse> {
    const response = await api.put<ReservationResponse>(`/admin/reservations/${id}`, data);
    return response.data;
  },

  /**
   * Delete a reservation (admin only)
   */
  async deleteReservation(id: number): Promise<void> {
    await api.delete(`/admin/reservations/${id}`);
  }
};
