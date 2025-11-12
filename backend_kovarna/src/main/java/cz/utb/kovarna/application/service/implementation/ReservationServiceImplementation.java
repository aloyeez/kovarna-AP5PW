package cz.utb.kovarna.application.service.implementation;

import cz.utb.kovarna.application.service.ReservationService;
import cz.utb.kovarna.application.dto.ReservationRequestDto;
import cz.utb.kovarna.application.dto.ReservationResponseDto;
import cz.utb.kovarna.domain.entity.Reservation;
import cz.utb.kovarna.domain.entity.ReservationSlot;
import cz.utb.kovarna.domain.entity.User;
import cz.utb.kovarna.infrastructure.repository.ReservationRepository;
import cz.utb.kovarna.infrastructure.repository.ReservationSlotRepository;
import cz.utb.kovarna.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImplementation implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationSlotRepository slotRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReservationResponseDto createReservation(String username, ReservationRequestDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ReservationSlot slot = slotRepository.findById(dto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        LocalDate date = dto.getDate();

        // 1 user → 1 reservation per day
        boolean hasReservation = reservationRepository.existsByUserAndReservationDate(user, date);
        if (hasReservation) {
            throw new RuntimeException("You already have a reservation on this day");
        }

        // Checking the user limit per slot
        if (slot.getCurrentReservations() >= slot.getMaxReservations()) {
            throw new RuntimeException("This slot is fully booked");
        }

        // Checking the number of guests
        if (dto.getGuestCount() < 1 || dto.getGuestCount() > 10) {
            throw new RuntimeException("Invalid number of guests (must be between 1 and 10)");
        }

        // Creating a new reservation
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setSlot(slot);
        reservation.setReservationDate(dto.getDate());
        reservation.setGuestCount(dto.getGuestCount());
        reservation.setStatus("ACTIVE");

        // Updating the number of occupied seats in the slot
        slot.setCurrentReservations(slot.getCurrentReservations() + 1);
        slotRepository.save(slot);

        Reservation saved = reservationRepository.save(reservation);

        ReservationResponseDto response = new ReservationResponseDto();
        response.setId(saved.getId());
        response.setReservationId(saved.getId()); // Backward compatibility
        response.setUsername(user.getUsername());
        response.setDate(saved.getReservationDate());
        response.setReservationDate(saved.getReservationDate()); // Backward compatibility
        response.setSlotFrom(slot.getSlotFrom());
        response.setSlotTo(slot.getSlotTo());
        response.setSlotId(slot.getId());
        response.setGuestCount(saved.getGuestCount());
        response.setStatus(saved.getStatus());
        return response;
    }

    @Override
    public List<ReservationResponseDto> getUserReservations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reservationRepository.findByUser(user).stream()
                .map(r -> {
                    ReservationResponseDto dto = new ReservationResponseDto();
                    dto.setId(r.getId());
                    dto.setReservationId(r.getId());
                    dto.setUsername(username);
                    dto.setDate(r.getReservationDate());
                    dto.setReservationDate(r.getReservationDate());
                    dto.setSlotFrom(r.getSlot().getSlotFrom());
                    dto.setSlotTo(r.getSlot().getSlotTo());
                    dto.setSlotId(r.getSlot().getId());
                    dto.setGuestCount(r.getGuestCount());
                    dto.setStatus(r.getStatus());
                    return dto;
                })
                .toList();
    }

    @Override
    @Transactional
    public void deleteReservationByUser(Long reservationId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!reservation.getUser().equals(user)) {
            throw new RuntimeException("You can only delete your own reservations");
        }

        // After deletion — reduce the number of occupied places in the slot
        ReservationSlot slot = reservation.getSlot();
        slot.setCurrentReservations(Math.max(0, slot.getCurrentReservations() - 1));
        slotRepository.save(slot);

        reservationRepository.delete(reservation);
    }
}
