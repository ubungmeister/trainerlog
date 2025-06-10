package com.trainerlog.dto;

import java.util.UUID;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class UserRequestDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    private UUID trainerId; //could be null in case of trainer registration
}

