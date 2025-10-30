package com.example.backend_kovarna.application.service;

import com.example.backend_kovarna.domain.dto.ReservationResponseDto;
import com.example.backend_kovarna.domain.dto.ReservationUpdateDto;
import com.example.backend_kovarna.domain.entity.Reservation;
import com.example.backend_kovarna.domain.entity.ReservationSlot;
import com.example.backend_kovarna.infrastructure.repository.ReservationRepository;
import com.example.backend_kovarna.infrastructure.repository.ReservationSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationSlotRepository reservationSlotRepository;

    public List<ReservationResponseDto> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ReservationResponseDto getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        return convertToDto(reservation);
    }

    @Transactional
    public ReservationResponseDto updateReservation(Long id, ReservationUpdateDto updateDto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        // If slot is being changed, update availability counters
        if (!reservation.getSlot().getId().equals(updateDto.getSlotId())) {
            // Decrease old slot's current reservations
            ReservationSlot oldSlot = reservation.getSlot();
            oldSlot.setCurrentReservations(oldSlot.getCurrentReservations() - 1);
            reservationSlotRepository.save(oldSlot);

            // Find and increase new slot's current reservations
            ReservationSlot newSlot = reservationSlotRepository.findById(updateDto.getSlotId())
                    .orElseThrow(() -> new RuntimeException("Reservation slot not found with id: " + updateDto.getSlotId()));

            if (newSlot.getCurrentReservations() >= newSlot.getMaxReservations()) {
                throw new RuntimeException("Slot is fully booked");
            }

            newSlot.setCurrentReservations(newSlot.getCurrentReservations() + 1);
            reservationSlotRepository.save(newSlot);
            reservation.setSlot(newSlot);
        }

        // Update reservation fields
        reservation.setReservationDate(updateDto.getReservationDate());
        reservation.setGuestCount(updateDto.getGuestCount());
        reservation.setStatus(updateDto.getStatus());

        Reservation updated = reservationRepository.save(reservation);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        // Decrease slot's current reservations
        ReservationSlot slot = reservation.getSlot();
        slot.setCurrentReservations(slot.getCurrentReservations() - 1);
        reservationSlotRepository.save(slot);

        reservationRepository.deleteById(id);
    }

    private ReservationResponseDto convertToDto(Reservation reservation) {
        ReservationResponseDto dto = new ReservationResponseDto();
        dto.setId(reservation.getId());
        dto.setUsername(reservation.getUser().getUsername());
        dto.setReservationDate(reservation.getReservationDate());
        dto.setGuestCount(reservation.getGuestCount());
        dto.setStatus(reservation.getStatus());
        dto.setSlotFrom(reservation.getSlot().getSlotFrom());
        dto.setSlotTo(reservation.getSlot().getSlotTo());
        dto.setSlotId(reservation.getSlot().getId());
        return dto;
    }
}
