package cz.utb.kovarna.infrastructure.repository;

import cz.utb.kovarna.domain.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Find all active events ordered by event date descending (most recent first)
     */
    List<Event> findByIsActiveTrueOrderByEventDateDesc();

    /**
     * Find all events (admin view) ordered by creation date descending
     */
    List<Event> findAllByOrderByCreatedAtDesc();
}
