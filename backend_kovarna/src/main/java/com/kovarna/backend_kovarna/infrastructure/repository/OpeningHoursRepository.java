package com.kovarna.backend_kovarna.infrastructure.repository;

import com.kovarna.backend_kovarna.domain.entity.OpeningHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.Optional;

@Repository
public interface OpeningHoursRepository extends JpaRepository<OpeningHours, Long> {
    Optional<OpeningHours> findByDayOfWeek(DayOfWeek dayOfWeek);
    boolean existsByDayOfWeek(DayOfWeek dayOfWeek);
}
