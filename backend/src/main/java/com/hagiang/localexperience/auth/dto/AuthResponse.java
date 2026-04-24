package com.hagiang.localexperience.auth.dto;

public class AuthResponse {

    private Long id;
    private String username;
    private String phoneNumber;
    private String role;

    public AuthResponse(Long id, String username, String phoneNumber, String role) {
        this.id = id;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRole() {
        return role;
    }
}
