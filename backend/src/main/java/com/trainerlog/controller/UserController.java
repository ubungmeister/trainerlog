package com.trainerlog.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;

import com.trainerlog.model.user.User;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.dto.ClientDto;
import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.dto.UserResponseDto;
import com.trainerlog.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import com.trainerlog.security.CustomUserPrincipal;
@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping
    public UserResponseDto createUser(@RequestBody UserRequestDto dto) {
        return userService.createUser(dto);
    }

    @GetMapping
    public List<User> getAllUsers() {
        System.err.println("users" + userService.getAllUsers());
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public UserResponseDto updateUser(@PathVariable UUID id, @RequestBody UserRequestDto dto) {
        return userService.updateUser(id, dto);
    }
        

    // Get All trainers
    @GetMapping("/trainers")
    public List<User> getAllTrainers() {
        return userRepository.findByRole(User.Role.TRAINER);
    }

    // Get All clients of a trainer
    @GetMapping("/me/clients")
    @Transactional
    public List<ClientDto> getClientsOfTrainer() {
        Authentication authorization = SecurityContextHolder.getContext().getAuthentication();
        CustomUserPrincipal user = (CustomUserPrincipal) authorization.getPrincipal();
        UUID trainerId = user.getId();
        return userService.getAllClientsForTrainer(trainerId);
    }
}