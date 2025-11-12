package cz.utb.kovarna.presentation.controller.admin;

import cz.utb.kovarna.application.dto.ReservationSlotDto;
import cz.utb.kovarna.application.service.ReservationSlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/slots")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Reservation Slots", description = "Admin endpoints for managing time slots")
@SecurityRequirement(name = "Bearer Authentication")
public class ReservationSlotController {

    private final ReservationSlotService slotService;

    @GetMapping
    public ResponseEntity<List<ReservationSlotDto>> getAllSlots() {
        return ResponseEntity.ok(slotService.getAllSlots());
    }

    @PostMapping
    public ResponseEntity<ReservationSlotDto> createSlot(@RequestBody ReservationSlotDto dto) {
        return ResponseEntity.ok(slotService.createSlot(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationSlotDto> updateSlot(
            @PathVariable Long id,
            @RequestBody ReservationSlotDto dto
    ) {
        return ResponseEntity.ok(slotService.updateSlot(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
