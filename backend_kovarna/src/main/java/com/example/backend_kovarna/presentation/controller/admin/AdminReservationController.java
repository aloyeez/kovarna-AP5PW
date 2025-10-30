package com.example.backend_kovarna.presentation.controller.admin;

import com.example.backend_kovarna.application.service.AdminReservationService;
import com.example.backend_kovarna.domain.dto.ReservationResponseDto;
import com.example.backend_kovarna.domain.dto.ReservationUpdateDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Reservations", description = "Admin endpoints for managing all reservations")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminReservationController {

    private final AdminReservationService adminReservationService;

    @Operation(summary = "Get all reservations", description = "Admin: Retrieve all reservations in the system")
    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getAllReservations() {
        List<ReservationResponseDto> reservations = adminReservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @Operation(summary = "Get reservation by ID", description = "Admin: Retrieve specific reservation")
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> getReservationById(@PathVariable Long id) {
        ReservationResponseDto reservation = adminReservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @Operation(summary = "Update reservation", description = "Admin: Update any reservation")
    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody ReservationUpdateDto updateDto) {
        ReservationResponseDto updated = adminReservationService.updateReservation(id, updateDto);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete reservation", description = "Admin: Delete any reservation")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        adminReservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
