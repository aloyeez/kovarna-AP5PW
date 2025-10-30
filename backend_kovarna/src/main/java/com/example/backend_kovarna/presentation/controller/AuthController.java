package com.example.backend_kovarna.presentation.controller;

import com.example.backend_kovarna.application.service.AuthService;
import com.example.backend_kovarna.domain.dto.AuthResponseDto;
import com.example.backend_kovarna.domain.dto.LoginRequestDto;
import com.example.backend_kovarna.domain.dto.UserRegistrationDto;
import com.example.backend_kovarna.domain.dto.UserResponseDto;
import com.example.backend_kovarna.domain.entity.User;
import com.example.backend_kovarna.infrastructure.config.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {
    private final AuthService authService;

    @Operation(
            summary = "Register new user",
            description = "Create a new user account with ROLE_CUSTOMER"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or user already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody @Valid UserRegistrationDto dto) {
        User user = authService.registerUser(dto);
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    @Operation(
            summary = "Login user",
            description = "Authenticate user and receive JWT token"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.authenticateUser(dto.getUsername(), dto.getPassword()));
    }

    @Operation(
            summary = "Get current user",
            description = "Retrieve authenticated user information",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User info retrieved",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserResponseDto(principal.getUser()));
    }
}
