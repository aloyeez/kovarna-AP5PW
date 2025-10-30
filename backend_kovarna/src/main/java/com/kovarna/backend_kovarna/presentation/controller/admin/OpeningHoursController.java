package com.kovarna.backend_kovarna.presentation.controller.admin;

import com.kovarna.backend_kovarna.application.service.OpeningHoursService;
import com.kovarna.backend_kovarna.domain.dto.OpeningHoursDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/admin/opening-hours")
@PreAuthorize("hasRole('ADMIN')")
public class OpeningHoursController {

    @Autowired
    private OpeningHoursService openingHoursService;

    @GetMapping
    public ResponseEntity<List<OpeningHoursDto>> getAllOpeningHours() {
        List<OpeningHoursDto> openingHours = openingHoursService.getAllOpeningHours();
        return ResponseEntity.ok(openingHours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpeningHoursDto> getOpeningHoursById(@PathVariable Long id) {
        OpeningHoursDto openingHours = openingHoursService.getOpeningHoursById(id);
        return ResponseEntity.ok(openingHours);
    }

    @GetMapping("/day/{dayOfWeek}")
    public ResponseEntity<OpeningHoursDto> getOpeningHoursByDay(@PathVariable DayOfWeek dayOfWeek) {
        OpeningHoursDto openingHours = openingHoursService.getOpeningHoursByDay(dayOfWeek);
        return ResponseEntity.ok(openingHours);
    }

    @PostMapping
    public ResponseEntity<OpeningHoursDto> createOpeningHours(@Valid @RequestBody OpeningHoursDto dto) {
        OpeningHoursDto created = openingHoursService.createOpeningHours(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpeningHoursDto> updateOpeningHours(
            @PathVariable Long id,
            @Valid @RequestBody OpeningHoursDto dto) {
        OpeningHoursDto updated = openingHoursService.updateOpeningHours(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOpeningHours(@PathVariable Long id) {
        openingHoursService.deleteOpeningHours(id);
        return ResponseEntity.noContent().build();
    }
}
