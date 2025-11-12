package cz.utb.kovarna.presentation.controller.admin;

import cz.utb.kovarna.application.service.UserManagementService;
import cz.utb.kovarna.application.dto.UserResponseDto;
import cz.utb.kovarna.application.dto.UserUpdateDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Users", description = "Admin endpoints for managing users")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserManagementService userManagementService;

    @Operation(summary = "Get all users", description = "Admin: Retrieve all users in the system")
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userManagementService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID", description = "Admin: Retrieve specific user")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        UserResponseDto user = userManagementService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Update user", description = "Admin: Update user info (cannot change password hash)")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto updateDto) {
        UserResponseDto updated = userManagementService.updateUser(id, updateDto);
        return ResponseEntity.ok(updated);
    }
}
