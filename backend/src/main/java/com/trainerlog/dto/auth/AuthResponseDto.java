package com.trainerlog.dto.auth;

import java.util.UUID;

import com.trainerlog.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDto {
    private String token;
    private String fullName;
    private UUID id;
    private String email;

    public static AuthResponseDto fromEntity(User user, String token) {
        AuthResponseDto dto = new AuthResponseDto();
        dto.setToken(token);
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        return dto;
    }
}