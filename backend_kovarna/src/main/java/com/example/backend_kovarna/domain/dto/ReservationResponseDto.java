package com.example.backend_kovarna.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDto {
    private Long id;
    private Long reservationId; // Kept for backward compatibility
    private String username;
    private LocalDate date;
    private LocalDate reservationDate; // Kept for backward compatibility
    private LocalTime slotFrom;
    private LocalTime slotTo;
    private Long slotId;
    private int guestCount;
    private String status;
}
