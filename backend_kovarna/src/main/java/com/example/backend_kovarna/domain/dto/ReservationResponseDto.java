package com.example.backend_kovarna.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ReservationResponseDto {
    private Long reservationId;
    private LocalDate date;
    private LocalTime slotFrom;
    private LocalTime slotTo;
    private int guestCount;
    private String status;
}
