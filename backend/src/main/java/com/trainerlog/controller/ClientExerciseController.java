package com.trainerlog.controller;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import com.trainerlog.dto.client_exercise.ClientExerciseRequestDto;
import com.trainerlog.dto.client_exercise.ClientExerciseResponseDto;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import com.trainerlog.service.client_exercise.ClientExerciseService;
import com.trainerlog.validation.ValidationGroups;
import java.util.List;
import jakarta.validation.Valid;
import com.trainerlog.util.SecurityUtil;
@RestController
@RequestMapping("/api/client_exercises")
@AllArgsConstructor

public class ClientExerciseController {

    private final ClientExerciseService clientExerciseService;

  

    @PostMapping("/create")
    public ClientExerciseResponseDto createClientExercise(@Valid @RequestBody ClientExerciseRequestDto clientExercise) {
        UUID trainerId =  SecurityUtil.getAuthorizedTrainerId();
        return clientExerciseService.createClientExercise(clientExercise, trainerId);
    }

    @PutMapping("/update/{id}")
    public ClientExerciseResponseDto updateClientExercise(@PathVariable UUID id, @Validated(ValidationGroups.Update.class) @RequestBody ClientExerciseRequestDto clientExercise) {
        UUID trainerId =  SecurityUtil.getAuthorizedTrainerId();
        return clientExerciseService.updateClientExercise(id, clientExercise, trainerId);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteClientExercise(@PathVariable UUID id, @RequestParam UUID clientId) {
        UUID trainerId =  SecurityUtil.getAuthorizedTrainerId();
        clientExerciseService.deleteClientExercise(id, trainerId, clientId);
    }

    // get all client exercises for a specific client
    @GetMapping("/all")
    public List<ClientExerciseResponseDto> getAllClientExercises(@RequestParam UUID clientId) {
        UUID trainerId =  SecurityUtil.getAuthorizedTrainerId();
        return clientExerciseService.getAllClientExercises(clientId, trainerId);
    }

    @GetMapping("/{id}")
    public ClientExerciseResponseDto getClientExerciseById(@PathVariable UUID id, @RequestParam UUID clientId) {
        UUID trainerId =  SecurityUtil.getAuthorizedTrainerId();
        return clientExerciseService.getClientExerciseById(id, clientId, trainerId);
    }

}