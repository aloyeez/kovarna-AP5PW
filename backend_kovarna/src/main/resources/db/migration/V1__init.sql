CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE users_roles (
                             user_id BIGINT NOT NULL,
                             role_id BIGINT NOT NULL,
                             PRIMARY KEY (user_id, role_id),
                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                             FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE reservation_slots (
                                   id BIGSERIAL PRIMARY KEY,
                                   slot_from TIME NOT NULL,
                                   slot_to TIME NOT NULL,
                                   is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                   CONSTRAINT chk_slot_time CHECK (slot_from < slot_to)
);

CREATE TABLE reservations (
                              id BIGSERIAL PRIMARY KEY,
                              user_id BIGINT NOT NULL,
                              slot_id BIGINT NOT NULL,
                              reservation_date DATE NOT NULL,
                              guest_count INT NOT NULL CHECK (guest_count > 0),
                              status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                              CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
                              CONSTRAINT fk_slot FOREIGN KEY (slot_id) REFERENCES reservation_slots(id)
);
