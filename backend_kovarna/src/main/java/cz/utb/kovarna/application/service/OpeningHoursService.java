package cz.utb.kovarna.application.service;

import cz.utb.kovarna.application.dto.OpeningHoursDto;
import cz.utb.kovarna.domain.entity.OpeningHours;
import cz.utb.kovarna.infrastructure.repository.OpeningHoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OpeningHoursService {

    @Autowired
    private OpeningHoursRepository openingHoursRepository;

    public List<OpeningHoursDto> getAllOpeningHours() {
        return openingHoursRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OpeningHoursDto getOpeningHoursById(Long id) {
        OpeningHours openingHours = openingHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opening hours not found with id: " + id));
        return convertToDto(openingHours);
    }

    public OpeningHoursDto getOpeningHoursByDay(DayOfWeek dayOfWeek) {
        OpeningHours openingHours = openingHoursRepository.findByDayOfWeek(dayOfWeek)
                .orElseThrow(() -> new RuntimeException("Opening hours not found for day: " + dayOfWeek));
        return convertToDto(openingHours);
    }

    @Transactional
    public OpeningHoursDto createOpeningHours(OpeningHoursDto dto) {
        // Check if opening hours already exist for this day
        if (openingHoursRepository.existsByDayOfWeek(dto.getDayOfWeek())) {
            throw new RuntimeException("Opening hours already exist for " + dto.getDayOfWeek());
        }

        // Validate times
        if (!dto.getOpenTime().isBefore(dto.getCloseTime())) {
            throw new RuntimeException("Open time must be before close time");
        }

        OpeningHours openingHours = convertToEntity(dto);
        OpeningHours saved = openingHoursRepository.save(openingHours);
        return convertToDto(saved);
    }

    @Transactional
    public OpeningHoursDto updateOpeningHours(Long id, OpeningHoursDto dto) {
        OpeningHours existing = openingHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opening hours not found with id: " + id));

        // If day of week is being changed, check for duplicates
        if (!existing.getDayOfWeek().equals(dto.getDayOfWeek()) &&
                openingHoursRepository.existsByDayOfWeek(dto.getDayOfWeek())) {
            throw new RuntimeException("Opening hours already exist for " + dto.getDayOfWeek());
        }

        // Validate times
        if (!dto.getOpenTime().isBefore(dto.getCloseTime())) {
            throw new RuntimeException("Open time must be before close time");
        }

        existing.setDayOfWeek(dto.getDayOfWeek());
        existing.setOpenTime(dto.getOpenTime());
        existing.setCloseTime(dto.getCloseTime());
        existing.setIsOpen(dto.getIsOpen());
        existing.setNote(dto.getNote());

        OpeningHours updated = openingHoursRepository.save(existing);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteOpeningHours(Long id) {
        if (!openingHoursRepository.existsById(id)) {
            throw new RuntimeException("Opening hours not found with id: " + id);
        }
        openingHoursRepository.deleteById(id);
    }

    private OpeningHoursDto convertToDto(OpeningHours entity) {
        OpeningHoursDto dto = new OpeningHoursDto();
        dto.setId(entity.getId());
        dto.setDayOfWeek(entity.getDayOfWeek());
        dto.setOpenTime(entity.getOpenTime());
        dto.setCloseTime(entity.getCloseTime());
        dto.setIsOpen(entity.getIsOpen());
        dto.setNote(entity.getNote());
        return dto;
    }

    private OpeningHours convertToEntity(OpeningHoursDto dto) {
        OpeningHours entity = new OpeningHours();
        entity.setDayOfWeek(dto.getDayOfWeek());
        entity.setOpenTime(dto.getOpenTime());
        entity.setCloseTime(dto.getCloseTime());
        entity.setIsOpen(dto.getIsOpen());
        entity.setNote(dto.getNote());
        return entity;
    }
}
