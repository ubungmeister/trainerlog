package com.trainerlog.dto.exercise;


import com.trainerlog.model.Exercise;

import lombok.Data;

@Data
public class ExerciseResponseDto {
    private String id;
    private String name;
    private boolean activeExercise;

    public ExerciseResponseDto(String id, String name, boolean activeExercise) {
        this.id = id;
        this.name = name;
        this.activeExercise = activeExercise;
    }

    public static ExerciseResponseDto fromEntity(Exercise exercise) {
        return new ExerciseResponseDto(exercise.getId().toString(), exercise.getName(), 
                                       exercise.isActiveExercise());
    }
    
}
