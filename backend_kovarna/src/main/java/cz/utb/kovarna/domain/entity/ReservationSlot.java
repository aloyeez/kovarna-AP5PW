package cz.utb.kovarna.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "reservation_slots")
@Getter
@Setter
@NoArgsConstructor
public class ReservationSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_from", nullable = false)
    private LocalTime slotFrom;

    @Column(name = "slot_to", nullable = false)
    private LocalTime slotTo;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "slot")
    private List<Reservation> reservations;

    @Column(name = "max_reservations", nullable = false)
    private int maxReservations;

    @Column(name = "current_reservations", nullable = false)
    private int currentReservations;

}
