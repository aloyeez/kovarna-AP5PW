package cz.utb.kovarna.presentation.controller;

import cz.utb.kovarna.application.service.OpeningHoursService;
import cz.utb.kovarna.application.dto.OpeningHoursDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/opening-hours")
@Tag(name = "Opening Hours", description = "Public endpoints for viewing restaurant opening hours")
public class OpeningHoursPublicController {

    @Autowired
    private OpeningHoursService openingHoursService;

    @Operation(summary = "Get all opening hours", description = "Get restaurant opening hours for all days of the week")
    @GetMapping
    public ResponseEntity<List<OpeningHoursDto>> getAllOpeningHours() {
        List<OpeningHoursDto> openingHours = openingHoursService.getAllOpeningHours();
        return ResponseEntity.ok(openingHours);
    }

    @Operation(summary = "Get opening hours by day", description = "Get opening hours for a specific day of the week")
    @GetMapping("/day/{dayOfWeek}")
    public ResponseEntity<OpeningHoursDto> getOpeningHoursByDay(@PathVariable DayOfWeek dayOfWeek) {
        OpeningHoursDto openingHours = openingHoursService.getOpeningHoursByDay(dayOfWeek);
        return ResponseEntity.ok(openingHours);
    }
}
