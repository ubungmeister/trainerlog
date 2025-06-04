package com.trainerlog.service;
import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.dto.UserResponseDto;
import java.util.List;
import com.trainerlog.model.user.User;
import java.util.UUID;

public interface UserService {
    UserResponseDto createUser(UserRequestDto dto);
    List<User> getAllUsers();
    UserResponseDto getUserById(UUID id);
    void deleteUser(UUID id);
    UserResponseDto updateUser(UUID id, UserRequestDto dto);
}

