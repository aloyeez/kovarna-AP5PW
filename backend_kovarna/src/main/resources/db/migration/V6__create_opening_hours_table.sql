-- Create opening_hours table
CREATE TABLE opening_hours (
    id BIGSERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL UNIQUE,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    note VARCHAR(500),
    CONSTRAINT chk_opening_times CHECK (open_time < close_time)
);

-- Insert default opening hours for all days
INSERT INTO opening_hours (day_of_week, open_time, close_time, is_open) VALUES
('MONDAY', '11:00', '22:00', true),
('TUESDAY', '11:00', '22:00', true),
('WEDNESDAY', '11:00', '22:00', true),
('THURSDAY', '11:00', '22:00', true),
('FRIDAY', '11:00', '23:00', true),
('SATURDAY', '12:00', '23:00', true),
('SUNDAY', '12:00', '21:00', true);
