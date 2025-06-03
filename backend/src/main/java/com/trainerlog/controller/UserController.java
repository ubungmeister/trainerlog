package com.trainerlog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.trainerlog.model.user.User;
import com.trainerlog.model.user.User.Role;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.service.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody UserRequestDto dto) {
        return userService.createUser(dto);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/ping")
    public String ping() {
        return "✅ Backend is working!";
    }

    // Get All trainers
    @GetMapping("/trainers")
    public List<User> getAllTrainers() {
        return userRepository.findByRole(User.Role.TRAINER);
    }

    // Get All clients of a trainer
    @GetMapping("/{trainerId}/clients")
    public List<User> getClientsOfTrainer(@PathVariable UUID trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        return trainer.getClients();
    }
}