package com.hagiang.localexperience.auth.service;

import com.hagiang.localexperience.auth.dto.AuthResponse;
import com.hagiang.localexperience.auth.dto.LoginRequest;
import com.hagiang.localexperience.auth.dto.RegisterRequest;
import com.hagiang.localexperience.auth.dto.RegisterResponse;
import com.hagiang.localexperience.auth.entity.Role;
import com.hagiang.localexperience.auth.entity.User;
import com.hagiang.localexperience.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterResponse register(RegisterRequest request) {
        validateRegisterRequest(request);
        String normalizedPhoneNumber = normalizePhoneNumber(request.getPhoneNumber());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByPhoneNumber(normalizedPhoneNumber)) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setPhoneNumber(normalizedPhoneNumber);
        user.setPassword(request.getPassword());
        user.setRole(parseRole(request.getRole()));

        User savedUser = userRepository.save(user);
        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getPhoneNumber(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null || !StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("Username and password are required");
        }

        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return new AuthResponse(user.getId(), user.getUsername(), user.getPhoneNumber(), user.getRole().name());
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null
                || !StringUtils.hasText(request.getUsername())
                || !StringUtils.hasText(request.getPassword())
                || !StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getPhoneNumber())
                || !StringUtils.hasText(request.getRole())) {
            throw new IllegalArgumentException("Username, password, email, phone number, and role are required");
        }
    }

    private String normalizePhoneNumber(String phoneNumber) {
        if (!StringUtils.hasText(phoneNumber)) {
            throw new IllegalArgumentException("Phone number is required");
        }

        String normalized = phoneNumber.replaceAll("[^\\d+]", "").trim();
        if (normalized.startsWith("+")) {
            normalized = normalized.substring(1);
        }

        if (!normalized.matches("\\d{9,15}")) {
            throw new IllegalArgumentException("Phone number must contain 9 to 15 digits");
        }

        return normalized;
    }

    private Role parseRole(String roleValue) {
        try {
            return Role.valueOf(roleValue.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Role must be ROLE_LOCAL_HOST or ROLE_USER");
        }
    }
}
