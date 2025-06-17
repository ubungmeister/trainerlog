package com.trainerlog.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;

import com.trainerlog.dto.exercise.ClientDto;
import com.trainerlog.dto.user.UserRequestDto;
import com.trainerlog.dto.user.UserResponseDto;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;
import com.trainerlog.service.user.UserService;
import com.trainerlog.util.SecurityUtil;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/create") // Endpoint for creating a new use
    public UserResponseDto createUser(@Valid @RequestBody UserRequestDto dto) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return userService.createUser(dto, trainerId);
    }

    @PutMapping("/update/{id}")
    public UserResponseDto updateUser(@PathVariable UUID id, @RequestBody UserRequestDto dto) {
            UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return userService.updateUser(id, dto, trainerId);
    }

     @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable UUID id) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        userService.deleteUser(id, trainerId);
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable UUID id) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId(); 
        return userService.getUserById(id, trainerId);
    }

    // Endpoint to get all clients of the current trainer
    @GetMapping("/me/clients") 
    public List<ClientDto> getClientsOfTrainer() {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return userService.getAllClientsForTrainer(trainerId);
    }
}