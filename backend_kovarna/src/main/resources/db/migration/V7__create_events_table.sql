-- Create events table for restaurant news and event posts with photos
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    photo_url VARCHAR(500),
    event_date DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index for filtering active events
CREATE INDEX idx_events_is_active ON events(is_active);

-- Create index for sorting by event date
CREATE INDEX idx_events_event_date ON events(event_date);
