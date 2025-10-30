package com.example.backend_kovarna.domain.dto;

import com.example.backend_kovarna.domain.entity.Role;
import com.example.backend_kovarna.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private Boolean enabled;
    private LocalDate reservationDate;
    private Set<String> roles;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.enabled = user.isEnabled();
        this.reservationDate = user.getReservationDate();
        this.roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
    }
}
