package com.trainerlog.service;

import com.trainerlog.dto.AuthRequestDto;
import com.trainerlog.dto.AuthResponseDto;
import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.dto.UserResponseDto;
import com.trainerlog.model.user.User;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDto login(AuthRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId());
        AuthResponseDto response = new AuthResponseDto();
        
        response.setToken(token);
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());

        return response;
    }

    @Override
    public UserResponseDto register(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword()))
            .fullName(dto.getFullName())
            .role(User.Role.valueOf(dto.getRole().toUpperCase()))
            .build();

        User savedUser = userRepository.save(user);
        return UserResponseDto.fromEntity(savedUser);
    }
}
