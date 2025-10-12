package com.example.backend_kovarna.infrastructure.repository;

import com.example.backend_kovarna.domain.entity.Reservation;
import com.example.backend_kovarna.domain.entity.ReservationSlot;
import com.example.backend_kovarna.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByReservationDateAndSlot(LocalDate date, ReservationSlot slot);
    List<Reservation> findByUser(User user);
    boolean existsByUserAndReservationDate(User user, LocalDate date);
}
