package com.trainerlog.service.session_exercise;
import com.trainerlog.dto.session_exercise.SessionExerciseRequestDto;
import com.trainerlog.dto.session_exercise.SessionExerciseResponseDto;
import java.util.UUID;
import java.util.List;

public interface SessionExerciseService { 

    public SessionExerciseResponseDto createSessionExercise( SessionExerciseRequestDto sessionExerciseRequestDto, UUID trainerId);
    public SessionExerciseResponseDto updateSessionExercise(UUID id, SessionExerciseRequestDto sessionExerciseRequestDto, UUID trainerId);
    public void deleteSessionExercise(UUID id, UUID trainerId);
    public SessionExerciseResponseDto getSessionExerciseById(UUID id, UUID trainerId);
    public List<SessionExerciseResponseDto> getAllSessionExercises(UUID clientId, UUID trainerId);
   
  

    
}
