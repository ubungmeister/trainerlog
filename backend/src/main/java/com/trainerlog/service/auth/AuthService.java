package com.trainerlog.service.auth;

import com.trainerlog.dto.auth.AuthRequestDto;
import com.trainerlog.dto.auth.AuthResponseDto;
import com.trainerlog.dto.user.UserRequestDto;
import com.trainerlog.dto.user.UserResponseDto;

public interface AuthService {

    AuthResponseDto login(AuthRequestDto dto);
    UserResponseDto register(UserRequestDto dto);

}
