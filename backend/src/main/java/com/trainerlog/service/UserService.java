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
        // создаём пустого пользователя
        User user = new User();

        // заполняем поля из DTO
        user.setFullName(dto.fullName);
        user.setEmail(dto.email);
        user.setPassword(dto.password);
        user.setRole(Role.valueOf(dto.role.toUpperCase()));

        // если указан тренер — ищем его в базе
        if (dto.trainerId != null) {
            User trainer = userRepository.findById(dto.trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
            user.setTrainer(trainer);
        }

        // сохраняем пользователя в БД
        return userRepository.save(user);
    }
}

