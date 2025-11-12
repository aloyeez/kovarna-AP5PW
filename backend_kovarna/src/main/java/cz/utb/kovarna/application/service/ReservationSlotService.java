package cz.utb.kovarna.application.service;

import cz.utb.kovarna.application.dto.ReservationSlotDto;
import cz.utb.kovarna.domain.entity.ReservationSlot;
import cz.utb.kovarna.infrastructure.repository.ReservationSlotRepository;
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

        // Set maxReservations with default of 10 if not provided
        if (dto.getMaxReservations() != null && dto.getMaxReservations() > 0) {
            slot.setMaxReservations(dto.getMaxReservations());
        } else {
            slot.setMaxReservations(10); // Default value
        }

        // Initialize currentReservations to 0
        slot.setCurrentReservations(0);

        return mapToDto(repository.save(slot));
    }

    public ReservationSlotDto updateSlot(Long id, ReservationSlotDto dto) {
        ReservationSlot slot = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        slot.setSlotFrom(dto.getSlotFrom());
        slot.setSlotTo(dto.getSlotTo());
        slot.setActive(dto.isActive());

        // Update maxReservations if provided
        if (dto.getMaxReservations() != null && dto.getMaxReservations() > 0) {
            slot.setMaxReservations(dto.getMaxReservations());
        }

        // Note: currentReservations is managed by reservation creation/deletion logic
        // and should not be directly updated here

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
        dto.setMaxReservations(slot.getMaxReservations());
        dto.setCurrentReservations(slot.getCurrentReservations());
        return dto;
    }
}
