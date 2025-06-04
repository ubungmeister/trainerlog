package com.trainerlog.dto;

import com.trainerlog.model.user.User;
import java.util.UUID;

// UserResponseDto.java
public class UserResponseDto {
    public UUID id;
    public String email;
    public String fullName;
    public String role;
    public UUID trainerId;
  
    public static UserResponseDto fromEntity(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.id = user.getId();
        dto.email = user.getEmail();
        dto.fullName = user.getFullName();
        dto.role = user.getRole().name();
        dto.trainerId = user.getTrainer() != null ? user.getTrainer().getId() : null;
        return dto;
    }
  }
  