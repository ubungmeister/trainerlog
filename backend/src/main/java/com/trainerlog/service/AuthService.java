package com.trainerlog.service;

import com.trainerlog.dto.AuthRequestDto;
import com.trainerlog.dto.AuthResponseDto;
import com.trainerlog.dto.UserRequestDto;
import com.trainerlog.dto.UserResponseDto;

public interface AuthService {

    AuthResponseDto login(AuthRequestDto dto);
    UserResponseDto register(UserRequestDto dto);

}
