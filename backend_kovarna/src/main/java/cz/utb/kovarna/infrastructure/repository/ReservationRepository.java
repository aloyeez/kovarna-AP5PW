package cz.utb.kovarna.infrastructure.repository;

import cz.utb.kovarna.domain.entity.Reservation;
import cz.utb.kovarna.domain.entity.ReservationSlot;
import cz.utb.kovarna.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByReservationDateAndSlot(LocalDate date, ReservationSlot slot);
    List<Reservation> findByUser(User user);
    boolean existsByUserAndReservationDate(User user, LocalDate date);
}
