import api from './api';

export interface ReservationSlotDto {
  id?: number;
  slotFrom: string; // "HH:mm:ss" format
  slotTo: string;   // "HH:mm:ss" format
  active: boolean;
  maxReservations?: number;
  currentReservations?: number;
}

export const adminService = {
  async getAllSlots(): Promise<ReservationSlotDto[]> {
    const response = await api.get<ReservationSlotDto[]>('/admin/slots');
    return response.data;
  },

  async createSlot(data: Omit<ReservationSlotDto, 'id'>): Promise<ReservationSlotDto> {
    const response = await api.post<ReservationSlotDto>('/admin/slots', data);
    return response.data;
  },

  async updateSlot(id: number, data: Omit<ReservationSlotDto, 'id'>): Promise<ReservationSlotDto> {
    const response = await api.put<ReservationSlotDto>(`/admin/slots/${id}`, data);
    return response.data;
  },

  async deleteSlot(id: number): Promise<void> {
    await api.delete(`/admin/slots/${id}`);
  }
};
