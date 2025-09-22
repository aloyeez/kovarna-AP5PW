package com.example.backend_kovarna.application.service.implementation;

import com.example.backend_kovarna.application.service.ReservationService;
import com.example.backend_kovarna.domain.dto.ReservationRequestDto;
import com.example.backend_kovarna.domain.dto.ReservationResponseDto;
import com.example.backend_kovarna.domain.entity.Reservation;
import com.example.backend_kovarna.domain.entity.ReservationSlot;
import com.example.backend_kovarna.domain.entity.User;
import com.example.backend_kovarna.infrastructure.repository.ReservationRepository;
import com.example.backend_kovarna.infrastructure.repository.ReservationSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImplementation implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationSlotRepository slotRepository;

    @Override
    @Transactional
    public ReservationResponseDto createReservation(User user, ReservationRequestDto dto) {
        ReservationSlot slot = slotRepository.findById(dto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // TODO: check whether amount of guests (user's input) is possible

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setSlot(slot);
        reservation.setReservationDate(dto.getDate());
        reservation.setGuestCount(dto.getGuestCount());
        reservation.setStatus("ACTIVE");

        Reservation saved = reservationRepository.save(reservation);

        return new ReservationResponseDto(
                saved.getId(),
                saved.getReservationDate(),
                slot.getSlotFrom(),
                slot.getSlotTo(),
                saved.getGuestCount(),
                saved.getStatus()
        );
    }

    @Override
    public List<ReservationResponseDto> getUserReservations(User user) {
        return reservationRepository.findByUser(user).stream()
                .map(r -> new ReservationResponseDto(
                        r.getId(),
                        r.getReservationDate(),
                        r.getSlot().getSlotFrom(),
                        r.getSlot().getSlotTo(),
                        r.getGuestCount(),
                        r.getStatus()
                ))
                .toList();
    }
}
