package com.trainerlog.service.user;

import com.trainerlog.dto.user.ClientDto;
import com.trainerlog.dto.user.UserRequestDto;
import com.trainerlog.dto.user.UserResponseDto;
import com.trainerlog.model.User;
import com.trainerlog.model.User.Role;
import com.trainerlog.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Implementation of the UserService interface that handles user-related operations.
 * This service manages user creation, updates, deletion, and retrieval operations.
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);


    /**
     * Creates a new user associated with a trainer.
     *
     * @param dto The user creation request data
     * @param trainerId The UUID of the trainer creating the user
     * @return UserResponseDto containing the created user's information
     * @throws RuntimeException if trainer is not found
     * @throws IllegalArgumentException if email already exists
     */
    @Override
    public UserResponseDto createUser(UserRequestDto dto, UUID trainerId) {
        log.info("Attempting to create user for trainerId={}, email={}", trainerId, dto.getEmail());
        User trainer = userRepository.findById(trainerId)
            .orElseThrow(() -> {
            log.error("Trainer with id={} not found", trainerId);
            return new RuntimeException("Trainer not found");
            });
                

        if (userRepository.existsByEmail(dto.getEmail())) {
            log.error("Email {} already exists for trainerId={}", dto.getEmail(), trainerId);
            throw new IllegalArgumentException("Email already exists");
        }

        User.UserBuilder user = User.builder()
            .fullName(dto.getFullName())
            .email(dto.getEmail())
            .password(null) // Password is set as null since we don't have user's mode in application
            .role(Role.CLIENT) //clinet by default when we creating new user (client)
            .trainer(trainer);

        try {
            User savedUser = userRepository.save(user.build());
            log.info("User created successfully with id={}", savedUser.getId());
            return UserResponseDto.fromEntity(savedUser);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating user: {}", e.getMessage());
            throw new IllegalArgumentException("Email already exists");
        }
    }

    /**
     * Updates an existing user's information.
     *
     * @param id The UUID of the user to update
     * @param dto The user update request data
     * @param trainerId The UUID of the trainer performing the update
     * @return UserResponseDto containing the updated user's information
     * @throws RuntimeException if user is not found or unauthorized
     * @throws IllegalArgumentException if email already exists
     */
    @Override
    public UserResponseDto updateUser(UUID id, UserRequestDto dto, UUID trainerId) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("You are not authorized to update this user");
        }

        if (userRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());

        User updatedUser = userRepository.save(user);
        return UserResponseDto.fromEntity(updatedUser);
    }

    /**
     * Deletes a user.
     *
     * @param id The UUID of the user to delete
     * @param trainerId The UUID of the trainer performing the deletion
     * @throws RuntimeException if user is not found or unauthorized
     */
    @Override
    public void deleteUser(UUID id, UUID trainerId) {
        log.info("Attempting to delete user with id={} for trainerId={}", id, trainerId);
        User user = userRepository.findById(id)
            .orElseThrow(() -> {
            log.error("Trainer with id={} not found", trainerId);
            return new RuntimeException("Trainer not found");
            });
        
        if (!user.getTrainer().getId().equals(trainerId)) {
            log.error("Unauthorized deletion attempt for user id={} by trainer id={}", id, trainerId);
            throw new RuntimeException("You are not authorized to delete this user");
        }
        userRepository.delete(user);
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param id The UUID of the user to retrieve
     * @param trainerId The UUID of the trainer requesting the user
     * @return UserResponseDto containing the user's information
     * @throws RuntimeException if user is not found or unauthorized
     */
    @Override
    public UserResponseDto getUserById(UUID id, UUID trainerId) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
        if (!user.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("You are not authorized to view this user");
        }
        
        return UserResponseDto.fromEntity(user);
    }

    /**
     * Retrieves all clients associated with a trainer.
     *
     * @param trainerId The UUID of the trainer
     * @return List of ClientDto containing basic client information
     * @throws RuntimeException if trainer is not found
     */
    @Override
    @Transactional
    public List<ClientDto> getAllClientsForTrainer(UUID trainerId) {
        User trainer = userRepository.findById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

        return trainer.getClients().stream()
            .map(client -> new ClientDto(client.getId(), client.getFullName(), client.getEmail()))
            .toList();
    }
}