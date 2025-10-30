package com.kovarna.backend_kovarna.presentation.controller;

import com.kovarna.backend_kovarna.application.service.OpeningHoursService;
import com.kovarna.backend_kovarna.domain.dto.OpeningHoursDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/opening-hours")
public class OpeningHoursPublicController {

    @Autowired
    private OpeningHoursService openingHoursService;

    @GetMapping
    public ResponseEntity<List<OpeningHoursDto>> getAllOpeningHours() {
        List<OpeningHoursDto> openingHours = openingHoursService.getAllOpeningHours();
        return ResponseEntity.ok(openingHours);
    }

    @GetMapping("/day/{dayOfWeek}")
    public ResponseEntity<OpeningHoursDto> getOpeningHoursByDay(@PathVariable DayOfWeek dayOfWeek) {
        OpeningHoursDto openingHours = openingHoursService.getOpeningHoursByDay(dayOfWeek);
        return ResponseEntity.ok(openingHours);
    }
}
