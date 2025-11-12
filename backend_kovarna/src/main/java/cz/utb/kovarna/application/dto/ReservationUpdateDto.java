package cz.utb.kovarna.application.dto;

import cz.utb.kovarna.domain.validation.FutureReservationDate;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationUpdateDto {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    @NotNull(message = "Reservation date is required")
    @FutureReservationDate(message = "Reservation date must be today or in the future")
    private LocalDate reservationDate;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "At least 1 guest is required")
    @Max(value = 10, message = "Maximum 10 guests allowed")
    private Integer guestCount;

    @NotBlank(message = "Status is required")
    private String status;
}
