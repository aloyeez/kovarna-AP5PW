package com.example.backend_kovarna.presentation.controller;

import com.example.backend_kovarna.application.service.AuthService;
import com.example.backend_kovarna.domain.dto.AuthResponseDto;
import com.example.backend_kovarna.domain.dto.LoginRequestDto;
import com.example.backend_kovarna.domain.dto.UserRegistrationDto;
import com.example.backend_kovarna.domain.dto.UserResponseDto;
import com.example.backend_kovarna.domain.entity.User;
import com.example.backend_kovarna.infrastructure.config.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody @Valid UserRegistrationDto dto) {
        User user = authService.registerUser(dto);
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.authenticateUser(dto.getUsername(), dto.getPassword()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserResponseDto(principal.getUser()));
    }
}
