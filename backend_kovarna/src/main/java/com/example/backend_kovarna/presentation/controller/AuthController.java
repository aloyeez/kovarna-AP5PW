package com.example.backend_kovarna.presentation.controller;

import com.example.backend_kovarna.application.service.AuthService;
import com.example.backend_kovarna.domain.dto.UserRegistrationDto;
import com.example.backend_kovarna.domain.dto.UserResponseDto;
import com.example.backend_kovarna.domain.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok("Current user: " + userDetails.getUsername());
    }
}
