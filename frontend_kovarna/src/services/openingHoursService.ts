import api from './api';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface OpeningHoursDto {
  id?: number;
  dayOfWeek: DayOfWeek;
  openTime: string; // LocalTime format "HH:mm:ss"
  closeTime: string; // LocalTime format "HH:mm:ss"
  isOpen: boolean;
  note?: string;
}

export const openingHoursService = {
  // ========== PUBLIC ENDPOINTS ==========

  /**
   * Get all opening hours (public access)
   */
  async getAllOpeningHours(): Promise<OpeningHoursDto[]> {
    const response = await api.get<OpeningHoursDto[]>('/api/opening-hours');
    return response.data;
  },

  /**
   * Get opening hours for a specific day (public access)
   * @param dayOfWeek MONDAY, TUESDAY, etc.
   */
  async getByDay(dayOfWeek: DayOfWeek): Promise<OpeningHoursDto> {
    const response = await api.get<OpeningHoursDto>(`/api/opening-hours/day/${dayOfWeek}`);
    return response.data;
  },

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Create new opening hours entry (admin only)
   */
  async createOpeningHours(data: OpeningHoursDto): Promise<OpeningHoursDto> {
    const response = await api.post<OpeningHoursDto>('/admin/opening-hours', data);
    return response.data;
  },

  /**
   * Update opening hours entry (admin only)
   */
  async updateOpeningHours(id: number, data: OpeningHoursDto): Promise<OpeningHoursDto> {
    const response = await api.put<OpeningHoursDto>(`/admin/opening-hours/${id}`, data);
    return response.data;
  },

  /**
   * Delete opening hours entry (admin only)
   */
  async deleteOpeningHours(id: number): Promise<void> {
    await api.delete(`/admin/opening-hours/${id}`);
  },

  /**
   * Get opening hours by ID (admin only)
   */
  async getById(id: number): Promise<OpeningHoursDto> {
    const response = await api.get<OpeningHoursDto>(`/admin/opening-hours/${id}`);
    return response.data;
  }
};
