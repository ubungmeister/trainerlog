package com.trainerlog.model.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
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

    // Дополнительно: получить всех тренеров
    @GetMapping("/trainers")
    public List<User> getAllTrainers() {
        return userRepository.findByRole(User.Role.TRAINER);
    }

    // Дополнительно: получить всех клиентов тренера
    @GetMapping("/{trainerId}/clients")
    public List<User> getClientsOfTrainer(@PathVariable UUID trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        return trainer.getClients();
    }
}