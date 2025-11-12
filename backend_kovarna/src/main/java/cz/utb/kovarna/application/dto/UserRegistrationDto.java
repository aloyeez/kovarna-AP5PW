package cz.utb.kovarna.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class UserRegistrationDto {

    @NotBlank
    private String username;

    @Email
    private String email;

    @NotBlank
    private String password;
}
