package com.example.backend_kovarna.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequestDto {
    @NotNull
    private Long slotId;

    @NotNull
    private LocalDate date;

    @Min(1)
    private int guestCount;
}
