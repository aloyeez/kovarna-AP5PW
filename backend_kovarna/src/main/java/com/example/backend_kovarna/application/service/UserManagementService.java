package com.example.backend_kovarna.application.service;

import com.example.backend_kovarna.domain.dto.UserResponseDto;
import com.example.backend_kovarna.domain.dto.UserUpdateDto;
import com.example.backend_kovarna.domain.entity.Role;
import com.example.backend_kovarna.domain.entity.User;
import com.example.backend_kovarna.infrastructure.repository.RoleRepository;
import com.example.backend_kovarna.infrastructure.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToResponseDto(user);
    }

    @Transactional
    public UserResponseDto updateUser(Long id, UserUpdateDto updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(updateDto.getUsername()) &&
                userRepository.findByUsername(updateDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists: " + updateDto.getUsername());
        }

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(updateDto.getEmail()) &&
                userRepository.findByEmail(updateDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + updateDto.getEmail());
        }

        // Update user fields (except password hash)
        user.setUsername(updateDto.getUsername());
        user.setEmail(updateDto.getEmail());
        user.setEnabled(updateDto.getEnabled());
        user.setReservationDate(updateDto.getReservationDate());

        // Update roles
        Set<Role> roles = new HashSet<>();
        for (String roleName : updateDto.getRoles()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            roles.add(role);
        }
        user.setRoles(roles);

        User updatedUser = userRepository.save(user);
        return convertToResponseDto(updatedUser);
    }

    private UserResponseDto convertToResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setEnabled(user.isEnabled());
        dto.setReservationDate(user.getReservationDate());
        dto.setRoles(user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet()));
        return dto;
    }
}
