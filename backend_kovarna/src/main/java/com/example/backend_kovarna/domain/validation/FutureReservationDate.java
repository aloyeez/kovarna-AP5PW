package com.example.backend_kovarna.domain.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure reservation date is in the future.
 * This annotation validates that a date is at least today or in the future.
 */
@Documented
@Constraint(validatedBy = FutureReservationDateValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface FutureReservationDate {

    String message() default "Reservation date must be today or in the future";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    /**
     * Minimum number of days in advance required for reservation.
     * Default is 0 (can be today).
     */
    int daysInAdvance() default 0;
}
