package com.example.backend_kovarna.application.service;

import com.example.backend_kovarna.domain.dto.ReservationSlotDto;
import com.example.backend_kovarna.domain.entity.ReservationSlot;
import com.example.backend_kovarna.infrastructure.repository.ReservationSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationSlotService {

    private final ReservationSlotRepository repository;

    public List<ReservationSlotDto> getAllSlots() {
        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ReservationSlotDto createSlot(ReservationSlotDto dto) {
        validateSlot(dto);

        boolean exists = repository.existsBySlotFromAndSlotTo(dto.getSlotFrom(), dto.getSlotTo());
        if (exists) {
            throw new IllegalArgumentException("Slot with this time range already exists");
        }
        
        ReservationSlot slot = new ReservationSlot();
        slot.setSlotFrom(dto.getSlotFrom());
        slot.setSlotTo(dto.getSlotTo());
        slot.setActive(dto.isActive());
        return mapToDto(repository.save(slot));
    }

    public ReservationSlotDto updateSlot(Long id, ReservationSlotDto dto) {
        ReservationSlot slot = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        slot.setSlotFrom(dto.getSlotFrom());
        slot.setSlotTo(dto.getSlotTo());
        slot.setActive(dto.isActive());

        return mapToDto(repository.save(slot));
    }

    public void deleteSlot(Long id) {
        repository.deleteById(id);
    }

    public List<ReservationSlotDto> getAvailableSlots(LocalDate date) {
        return repository.findAll().stream()
                .filter(ReservationSlot::isActive)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void validateSlot(ReservationSlotDto dto) {
        if (dto.getSlotFrom() == null || dto.getSlotTo() == null) {
            throw new IllegalArgumentException("Slot times cannot be null");
        }
        if (!dto.getSlotFrom().isBefore(dto.getSlotTo())) {
            throw new IllegalArgumentException("Slot start must be before slot end");
        }
    }

    private ReservationSlotDto mapToDto(ReservationSlot slot) {
        ReservationSlotDto dto = new ReservationSlotDto();
        dto.setId(slot.getId());
        dto.setSlotFrom(slot.getSlotFrom());
        dto.setSlotTo(slot.getSlotTo());
        dto.setActive(slot.isActive());
        return dto;
    }
}
