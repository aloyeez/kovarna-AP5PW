package cz.utb.kovarna.presentation.controller;

import cz.utb.kovarna.application.service.ReservationService;
import cz.utb.kovarna.application.service.ReservationSlotService;
import cz.utb.kovarna.application.dto.ReservationRequestDto;
import cz.utb.kovarna.application.dto.ReservationResponseDto;
import cz.utb.kovarna.application.dto.ReservationSlotDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservations", description = "Customer reservation management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationSlotService slotService;

    @Operation(summary = "Create reservation", description = "Create a new reservation for authenticated user")
    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(
            Authentication authentication,
            @RequestBody @Valid ReservationRequestDto dto
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(reservationService.createReservation(username, dto));
    }

    @Operation(summary = "Get my reservations", description = "Retrieve all reservations for authenticated user")
    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getMyReservations(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(reservationService.getUserReservations(username));
    }

    @Operation(summary = "Get available slots", description = "Get available reservation slots for a specific date (public)")
    @GetMapping("/slots")
    public ResponseEntity<List<ReservationSlotDto>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(slotService.getAvailableSlots(date));
    }

    @Operation(summary = "Delete reservation", description = "Delete user's own reservation")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String username = authentication.getName();
        reservationService.deleteReservationByUser(id, username);
        return ResponseEntity.ok("Reservation deleted successfully");
    }
}
