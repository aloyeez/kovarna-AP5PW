package com.example.backend_kovarna.application.service;

import com.example.backend_kovarna.domain.dto.UserRegistrationDto;
import com.example.backend_kovarna.domain.entity.User;

public interface AuthService {
    User registerUser(UserRegistrationDto dto);
}
