package cz.utb.kovarna.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

/**
 * DTO for admin updating user information.
 * NOTE: Password hash cannot be changed for security reasons.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Enabled status is required")
    private Boolean enabled;

    private LocalDate reservationDate;

    @NotNull(message = "Roles are required")
    @Size(min = 1, message = "At least one role is required")
    private Set<String> roles; // Role names like "ROLE_ADMIN", "ROLE_CUSTOMER"
}
