package com.example.backend_kovarna.presentation.controller;

import com.example.backend_kovarna.application.service.ReservationService;
import com.example.backend_kovarna.application.service.ReservationSlotService;
import com.example.backend_kovarna.domain.dto.ReservationRequestDto;
import com.example.backend_kovarna.domain.dto.ReservationResponseDto;
import com.example.backend_kovarna.domain.dto.ReservationSlotDto;
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
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationSlotService slotService;

    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(
            Authentication authentication,
            @RequestBody @Valid ReservationRequestDto dto
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(reservationService.createReservation(username, dto));
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getMyReservations(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(reservationService.getUserReservations(username));
    }

    @GetMapping("/slots")
    public ResponseEntity<List<ReservationSlotDto>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(slotService.getAvailableSlots(date));
    }

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
