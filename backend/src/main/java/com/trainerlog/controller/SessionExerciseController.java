package com.trainerlog.controller;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.trainerlog.dto.session_exercise.SessionExerciseResponseDto;
import com.trainerlog.service.session_exercise.SessionExerciseService;
import com.trainerlog.dto.session_exercise.SessionExerciseRequestDto;
import com.trainerlog.util.SecurityUtil;

import java.util.UUID;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@AllArgsConstructor
@RequestMapping("/api/session-exercises")
public class SessionExerciseController {

    private final SessionExerciseService sessionExerciseService;


    @PostMapping("/create")
    public SessionExerciseResponseDto createSessionExercise(@RequestBody SessionExerciseRequestDto sessionExerciseRequestDto) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return sessionExerciseService.createSessionExercise(sessionExerciseRequestDto, trainerId);
    }
    @PutMapping("/update/{id}")
    public SessionExerciseResponseDto updateSessionExercise(@PathVariable UUID id ,@RequestBody SessionExerciseRequestDto sessionExerciseRequestDto) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return sessionExerciseService.updateSessionExercise(id, sessionExerciseRequestDto, trainerId);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSessionExercise(@PathVariable UUID id) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        sessionExerciseService.deleteSessionExercise(id, trainerId);
        return ResponseEntity.noContent().build();
     }
    @GetMapping("/{id}")
    public SessionExerciseResponseDto getSessionExerciseById(@PathVariable UUID id) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return sessionExerciseService.getSessionExerciseById(id, trainerId);
    }
    @GetMapping("/all")
    public List<SessionExerciseResponseDto> getAllSessionExercises(@RequestParam UUID clientId) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return sessionExerciseService.getAllSessionExercises(clientId, trainerId);
    }
    
}
