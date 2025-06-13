package com.trainerlog.service.exercise;
import com.trainerlog.dto.exercise.ExerciseRequestDto;
import com.trainerlog.dto.exercise.ExerciseResponseDto;
import java.util.UUID;
import java.util.List;
public interface ExerciseService {

    ExerciseResponseDto createExercise(ExerciseRequestDto dto, UUID trainerId);
    ExerciseResponseDto updateExercise(UUID id, ExerciseRequestDto dto, UUID trainerId);
    void deleteExercise(UUID id, UUID trainerId);
    List <ExerciseResponseDto> getAllExercises(UUID trainerId);
    
}
