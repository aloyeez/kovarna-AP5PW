package com.example.backend_kovarna.infrastructure.repository;

import com.example.backend_kovarna.domain.entity.ReservationSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;

public interface ReservationSlotRepository extends JpaRepository<ReservationSlot, Long> {
    boolean existsBySlotFromAndSlotTo(LocalTime slotFrom, LocalTime slotTo);
}
