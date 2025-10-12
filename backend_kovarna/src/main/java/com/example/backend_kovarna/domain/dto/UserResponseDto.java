package com.example.backend_kovarna.domain.dto;

import com.example.backend_kovarna.domain.entity.Role;
import com.example.backend_kovarna.domain.entity.User;
import lombok.Getter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class UserResponseDto {
    private final Long id;
    private final String username;
    private final String email;
    private final Set<String> roles;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
    }
}
