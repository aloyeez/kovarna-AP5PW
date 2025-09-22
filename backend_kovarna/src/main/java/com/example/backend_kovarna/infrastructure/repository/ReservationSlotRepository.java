package com.example.backend_kovarna.infrastructure.repository;

import com.example.backend_kovarna.domain.entity.ReservationSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationSlotRepository extends JpaRepository<ReservationSlot, Long> {
}
