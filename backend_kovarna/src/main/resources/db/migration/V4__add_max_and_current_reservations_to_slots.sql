ALTER TABLE reservation_slots
ADD COLUMN max_reservations INT NOT NULL DEFAULT 10,
ADD COLUMN current_reservations INT NOT NULL DEFAULT 0;
