import api from './api';

export interface ReservationSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  isAvailable: boolean;
  capacity: number;
}

export interface ReservationRequest {
  slotId: string;
  numberOfGuests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
}

export interface ReservationResponse {
  id: string;
  slotId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
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

  async cancelReservation(id: string): Promise<void> {
    await api.delete(`/api/reservations/${id}`);
  },

  async getReservationById(id: string): Promise<ReservationResponse> {
    const response = await api.get<ReservationResponse>(`/api/reservations/${id}`);
    return response.data;
  }
};