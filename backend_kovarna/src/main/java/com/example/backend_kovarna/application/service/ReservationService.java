package com.example.backend_kovarna.application.service;

import com.example.backend_kovarna.domain.dto.ReservationRequestDto;
import com.example.backend_kovarna.domain.dto.ReservationResponseDto;

import java.util.List;

public interface ReservationService {
    ReservationResponseDto createReservation(String username, ReservationRequestDto dto);
    List<ReservationResponseDto> getUserReservations(String username);
    void deleteReservationByUser(Long reservationId, String username);
}
