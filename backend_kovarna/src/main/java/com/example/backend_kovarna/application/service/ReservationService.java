package com.example.backend_kovarna.application.service;

import com.example.backend_kovarna.domain.dto.ReservationRequestDto;
import com.example.backend_kovarna.domain.dto.ReservationResponseDto;
import com.example.backend_kovarna.domain.entity.User;

import java.util.List;

public interface ReservationService {
    ReservationResponseDto createReservation(User user, ReservationRequestDto dto);
    List<ReservationResponseDto> getUserReservations(User user);
}
