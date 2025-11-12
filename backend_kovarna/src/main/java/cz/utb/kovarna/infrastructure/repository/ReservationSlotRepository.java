package cz.utb.kovarna.infrastructure.repository;

import cz.utb.kovarna.domain.entity.ReservationSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;

public interface ReservationSlotRepository extends JpaRepository<ReservationSlot, Long> {
    boolean existsBySlotFromAndSlotTo(LocalTime slotFrom, LocalTime slotTo);
}
