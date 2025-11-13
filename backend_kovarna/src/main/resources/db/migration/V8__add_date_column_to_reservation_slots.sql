-- Add date column to reservation_slots table
ALTER TABLE reservation_slots
ADD COLUMN reservation_date DATE;

-- Create index for filtering by date
CREATE INDEX idx_reservation_slots_date ON reservation_slots(reservation_date);
