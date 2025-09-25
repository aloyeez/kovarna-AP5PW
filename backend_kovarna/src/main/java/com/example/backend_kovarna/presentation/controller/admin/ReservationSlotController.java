package com.example.backend_kovarna.presentation.controller.admin;

import com.example.backend_kovarna.domain.dto.ReservationSlotDto;
import com.example.backend_kovarna.application.service.ReservationSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/slots")
@RequiredArgsConstructor
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
