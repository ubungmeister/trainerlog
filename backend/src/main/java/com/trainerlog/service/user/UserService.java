package com.trainerlog.service.user;
import com.trainerlog.dto.user.ClientDto;
import com.trainerlog.dto.user.UserRequestDto;
import com.trainerlog.dto.user.UserResponseDto;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserResponseDto createUser(UserRequestDto dto, UUID trainerId);
    UserResponseDto getUserById(UUID id, UUID trainerId);
    void deleteUser(UUID id, UUID trainerId);
    UserResponseDto updateUser(UUID id, UserRequestDto dto, UUID trainerId);
    List<ClientDto> getAllClientsForTrainer(UUID trainerId);
}

