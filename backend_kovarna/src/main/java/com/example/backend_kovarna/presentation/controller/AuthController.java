package com.example.backend_kovarna.presentation.controller;

import com.example.backend_kovarna.application.service.AuthService;
import com.example.backend_kovarna.domain.dto.UserRegistrationDto;
import com.example.backend_kovarna.domain.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid UserRegistrationDto dto) {
        User user = authService.registerUser(dto);
        return ResponseEntity.ok(user);
    }
}
