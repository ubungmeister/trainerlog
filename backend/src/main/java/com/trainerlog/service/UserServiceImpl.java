package com.trainerlog.service;

import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.dto.UserResponseDto;
import com.trainerlog.model.user.User;
import com.trainerlog.model.user.User.Role;
import com.trainerlog.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDto createUser(UserRequestDto dto) {
        // checking is the user alrady exist
        if (userRepository.existsByEmail(dto.email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        
        if (dto.role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }

        User.UserBuilder user = User.builder()
            .fullName(dto.fullName)
            .email(dto.email)
            .password(dto.password)
            .role(Role.valueOf(dto.role.toUpperCase()));
    
        if (dto.trainerId != null) {
            User trainer = userRepository.findById(dto.trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
            user.trainer(trainer);
        }
    
        try {
            User savedUser = userRepository.save(user.build());
            return UserResponseDto.fromEntity(savedUser);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserResponseDto  getUserById(UUID id){
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
         return UserResponseDto.fromEntity(user);
    }

    @Override

    public void deleteUser(UUID id){
        User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    @Override

    public UserResponseDto updateUser(UUID id, UserRequestDto dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.fullName != null) {
            user.setFullName(dto.fullName);
        }
        if (dto.email != null) {
            user.setEmail(dto.email);
        }
        if (dto.password != null) {
            user.setPassword(dto.password);
        }
        if (dto.role != null) {
            user.setRole(Role.valueOf(dto.role.toUpperCase()));
        }

        if (dto.trainerId != null) {
            User trainer = userRepository.findById(dto.trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
            user.setTrainer(trainer);
        }

        User updatedUser = userRepository.save(user);
        return UserResponseDto.fromEntity(updatedUser);
    }
    
}
