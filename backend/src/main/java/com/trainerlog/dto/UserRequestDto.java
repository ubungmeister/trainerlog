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

    private String password; //for now is null
    private String role; //set as CLIENT by deafault on the server side

    private UUID trainerId; //could be null in case of trainer registration
}

