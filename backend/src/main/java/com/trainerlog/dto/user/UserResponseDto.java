package com.trainerlog.dto.user;

import java.util.UUID;

import com.trainerlog.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

///

public class UserResponseDto {
    private UUID id;
    private String email;
    private String fullName;
    private String role;    
    private UUID trainerId;  


    public UserResponseDto(UUID id, String email, String fullName, String role, UUID trainerId) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.trainerId = trainerId;
    }
    public static UserResponseDto fromEntity(User user) {
        return new UserResponseDto(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name(),
            user.getTrainer() != null ? user.getTrainer().getId() : null
        );
    }
   
  }
  