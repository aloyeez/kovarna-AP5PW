package cz.utb.kovarna.application.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class ReservationSlotDto {
    private Long id;
    private LocalTime slotFrom;
    private LocalTime slotTo;
    private boolean active;
    private Integer maxReservations;
    private Integer currentReservations;
}

