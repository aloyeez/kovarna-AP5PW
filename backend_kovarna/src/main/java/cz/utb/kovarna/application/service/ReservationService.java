package cz.utb.kovarna.application.service;

import cz.utb.kovarna.application.dto.ReservationRequestDto;
import cz.utb.kovarna.application.dto.ReservationResponseDto;

import java.util.List;

public interface ReservationService {
    ReservationResponseDto createReservation(String username, ReservationRequestDto dto);
    List<ReservationResponseDto> getUserReservations(String username);
    void deleteReservationByUser(Long reservationId, String username);
}
