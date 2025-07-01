package com.trainerlog.dto.exercise;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExerciseRequestDto {
    private UUID id;
    private boolean activeExercise;
    @NotBlank(message = "Name is required")
    private String name;
    private UUID categoryId;

}
