package com.example.backend_kovarna.presentation.controller;

import com.example.backend_kovarna.application.service.ReservationService;
import com.example.backend_kovarna.application.service.ReservationSlotService;
import com.example.backend_kovarna.domain.dto.ReservationRequestDto;
import com.example.backend_kovarna.domain.dto.ReservationResponseDto;
import com.example.backend_kovarna.domain.dto.ReservationSlotDto;
import com.example.backend_kovarna.domain.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal User user,
            @RequestBody @Valid ReservationRequestDto dto
    ) {
        return ResponseEntity.ok(reservationService.createReservation(user, dto));
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getMyReservations(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(reservationService.getUserReservations(user));
    }

    @GetMapping("/slots")
    public ResponseEntity<List<ReservationSlotDto>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(slotService.getAvailableSlots(date));
    }
}
