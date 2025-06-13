package com.trainerlog.dto.auth;

import lombok.Data;

@Data
public class AuthRequestDto {
    private String email;
    private String password;
}
