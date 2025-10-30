import api from './api';

export interface ReservationSlot {
  id: number; // Backend uses Long
  slotFrom: string; // LocalTime format "HH:mm:ss"
  slotTo: string; // LocalTime format "HH:mm:ss"
  active: boolean;
  currentReservations?: number; // Optional for availability display
  maxReservations?: number; // Optional for availability display
}

export interface ReservationRequest {
  slotId: number; // Backend expects Long
  date: string; // LocalDate format "YYYY-MM-DD"
  guestCount: number; // Must be 1-10
}

export interface ReservationResponse {
  id: number;
  reservationId: number;
  username: string;
  date: string; // LocalDate
  reservationDate: string; // LocalDate (when reservation was made)
  slotFrom: string; // LocalTime
  slotTo: string; // LocalTime
  slotId: number;
  guestCount: number;
  status: string; // "ACTIVE", "CANCELLED", etc.
}

export const reservationService = {
  async getAvailableSlots(date: string): Promise<ReservationSlot[]> {
    const response = await api.get<ReservationSlot[]>('/api/reservations/slots', {
      params: { date }
    });
    return response.data;
  },

  async createReservation(data: ReservationRequest): Promise<ReservationResponse> {
    const response = await api.post<ReservationResponse>('/api/reservations', data);
    return response.data;
  },

  async getUserReservations(): Promise<ReservationResponse[]> {
    const response = await api.get<ReservationResponse[]>('/api/reservations');
    return response.data;
  },

  async cancelReservation(id: number): Promise<void> {
    await api.delete(`/api/reservations/${id}`);
  },

  async getReservationById(id: number): Promise<ReservationResponse> {
    const response = await api.get<ReservationResponse>(`/api/reservations/${id}`);
    return response.data;
  }
};