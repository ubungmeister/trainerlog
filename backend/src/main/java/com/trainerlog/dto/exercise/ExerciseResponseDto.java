package com.trainerlog.dto.exercise;


import com.trainerlog.model.Exercise;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExerciseResponseDto {
    private String id;
    private String name;

    public ExerciseResponseDto(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ExerciseResponseDto fromEntity(Exercise exercise) {
        return new ExerciseResponseDto(exercise.getId().toString(), exercise.getName());
    }
    
}
