package com.trainerlog.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.trainerlog.model.user.User;
import com.trainerlog.model.user.User.Role;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.dto.UserRequestDto;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(UserRequestDto dto) {
        // create a new user
        User user = new User();

        // fill the fields from the DTO
        user.setFullName(dto.fullName);
        user.setEmail(dto.email);
        user.setPassword(dto.password);
        user.setRole(Role.valueOf(dto.role.toUpperCase()));

        // if a trainer is specified, find him in the database
        if (dto.trainerId != null) {
            User trainer = userRepository.findById(dto.trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
            user.setTrainer(trainer);
        }

        // save the user to the database
        return userRepository.save(user);
    }
}

