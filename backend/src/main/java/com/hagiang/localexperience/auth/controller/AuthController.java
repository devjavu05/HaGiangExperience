package com.hagiang.localexperience.auth.controller;

import com.hagiang.localexperience.auth.dto.AuthResponse;
import com.hagiang.localexperience.auth.dto.LoginRequest;
import com.hagiang.localexperience.auth.dto.RegisterRequest;
import com.hagiang.localexperience.auth.dto.RegisterResponse;
import com.hagiang.localexperience.auth.dto.UpdatePhoneNumberRequest;
import com.hagiang.localexperience.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/profile/phone-number")
    public ResponseEntity<AuthResponse> updatePhoneNumber(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody UpdatePhoneNumberRequest request
    ) {
        return ResponseEntity.ok(authService.updatePhoneNumber(userId, request));
    }
}
