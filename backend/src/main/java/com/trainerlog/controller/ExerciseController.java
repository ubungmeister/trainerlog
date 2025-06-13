package com.trainerlog.controller;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.trainerlog.security.CustomUserPrincipal;
import com.trainerlog.service.user.UserService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.trainerlog.dto.exercise.ExerciseRequestDto;
import com.trainerlog.dto.exercise.ExerciseResponseDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import com.trainerlog.service.exercise.ExerciseService;
import java.util.List;
@RestController
@AllArgsConstructor
@RequestMapping("/api/exercises")

public class ExerciseController {

    private final ExerciseService exerciseService;

        // Authentication method to get the current trainer's ID
    private UUID getAuthorizedTrainerId() {
        Authentication authorization = SecurityContextHolder.getContext().getAuthentication();
        CustomUserPrincipal user = (CustomUserPrincipal) authorization.getPrincipal();
        return user.getId();
    }

    @PostMapping("/create")
    public ExerciseResponseDto createExercise(@Valid @RequestBody ExerciseRequestDto dto) {
        UUID trainerId = getAuthorizedTrainerId();
        return exerciseService.createExercise(dto, trainerId);
    }
    @PutMapping("/update/{id}")
    public ExerciseResponseDto updateExercise(@PathVariable UUID id, @Valid @RequestBody ExerciseRequestDto dto) {
        UUID trainerId = getAuthorizedTrainerId();
        return exerciseService.updateExercise(id, dto, trainerId);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteExercise(@PathVariable UUID id) {
        UUID trainerId = getAuthorizedTrainerId();
        exerciseService.deleteExercise(id, trainerId);
    }   

    @GetMapping("/all")
    public List<ExerciseResponseDto> getAllExercises() {
        UUID trainerId = getAuthorizedTrainerId();
        return exerciseService.getAllExercises(trainerId);
    }

    
}
