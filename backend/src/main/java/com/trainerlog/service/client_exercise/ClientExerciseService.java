package com.trainerlog.service.client_exercise;

import java.util.List;
import java.util.UUID;

import com.trainerlog.dto.client_exercise.ClientExerciseRequestDto;
import com.trainerlog.dto.client_exercise.ClientExerciseResponseDto;
 
public  interface ClientExerciseService {
    public ClientExerciseResponseDto createClientExercise(ClientExerciseRequestDto clientExercise, UUID trainerId);
    public ClientExerciseResponseDto updateClientExercise(UUID id, ClientExerciseRequestDto clientExercise, UUID trainerId);
    public void deleteClientExercise(UUID id, UUID trainerId, UUID clientId);
    List<ClientExerciseResponseDto> getAllClientExercises(UUID clientId , UUID trainerId);
    ClientExerciseResponseDto getClientExerciseById( UUID id, UUID clientId, UUID trainerId);
    
}
