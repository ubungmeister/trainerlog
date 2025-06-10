package com.trainerlog.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;

import com.trainerlog.dto.ClientDto;
import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.dto.UserResponseDto;
import com.trainerlog.service.UserService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.UUID;
import com.trainerlog.security.CustomUserPrincipal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    // Authentication method to get the current trainer's ID
    private UUID getAuthorizedTrainerId() {
        Authentication authorization = SecurityContextHolder.getContext().getAuthentication();
        CustomUserPrincipal user = (CustomUserPrincipal) authorization.getPrincipal();
        return user.getId();
    }

    @PostMapping("/create") // Endpoint for creating a new use
    public UserResponseDto createUser(@Valid @RequestBody UserRequestDto dto) {
        return userService.createUser(dto, getAuthorizedTrainerId());
    }

    @PutMapping("/{id}")
    public UserResponseDto updateUser(@PathVariable UUID id, @RequestBody UserRequestDto dto) {
            UUID trainerId = getAuthorizedTrainerId(); 
        return userService.updateUser(id, dto, trainerId);
    }

     @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        UUID trainerId = getAuthorizedTrainerId(); 
        userService.deleteUser(id, trainerId);
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable UUID id) {
        UUID trainerId = getAuthorizedTrainerId(); 
        return userService.getUserById(id, trainerId);
    }

    // Endpoint to get all clients of the current trainer
    @GetMapping("/me/clients") 
    public List<ClientDto> getClientsOfTrainer() {
        UUID trainerId = getAuthorizedTrainerId(); 
        return userService.getAllClientsForTrainer(trainerId);
    }
}