package cz.utb.kovarna.domain.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

/**
 * Validator implementation for @FutureReservationDate annotation.
 * Validates that a LocalDate is not in the past.
 */
public class FutureReservationDateValidator implements ConstraintValidator<FutureReservationDate, LocalDate> {

    private int daysInAdvance;

    @Override
    public void initialize(FutureReservationDate constraintAnnotation) {
        this.daysInAdvance = constraintAnnotation.daysInAdvance();
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
        // Null values are handled by @NotNull annotation separately
        if (value == null) {
            return true;
        }

        LocalDate minimumDate = LocalDate.now().plusDays(daysInAdvance);
        return !value.isBefore(minimumDate);
    }
}
