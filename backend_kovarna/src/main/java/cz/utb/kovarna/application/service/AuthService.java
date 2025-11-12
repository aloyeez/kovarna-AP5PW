package cz.utb.kovarna.application.service;

import cz.utb.kovarna.application.dto.AuthResponseDto;
import cz.utb.kovarna.application.dto.UserRegistrationDto;
import cz.utb.kovarna.domain.entity.User;

public interface AuthService {
    User registerUser(UserRegistrationDto dto);
    AuthResponseDto authenticateUser(String username, String password);
    User findByUsername(String username);
}
