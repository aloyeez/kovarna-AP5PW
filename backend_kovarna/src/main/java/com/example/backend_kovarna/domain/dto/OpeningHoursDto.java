package com.example.backend_kovarna.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpeningHoursDto {

    private Long id;

    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "Opening time is required")
    private LocalTime openTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closeTime;

    @NotNull(message = "isOpen flag is required")
    private Boolean isOpen;

    private String note;
}
