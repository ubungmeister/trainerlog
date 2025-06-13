package com.trainerlog.controller;

import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;

import com.trainerlog.dto.auth.AuthRequestDto;
import com.trainerlog.dto.auth.AuthResponseDto;
import com.trainerlog.dto.user.UserRequestDto;
import com.trainerlog.dto.user.UserResponseDto;
import com.trainerlog.service.auth.AuthService;


@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor

public class AuthController {

    private final AuthService authService;
    

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody AuthRequestDto dto) {
        return authService.login(dto);
    }

    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto dto) {
        return authService.register(dto);
    }
}
