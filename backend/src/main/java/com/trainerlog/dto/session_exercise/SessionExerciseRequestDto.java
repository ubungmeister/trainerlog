package com.trainerlog.dto.session_exercise;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SessionExerciseRequestDto {

    private UUID trainingSessionId;
    private UUID exerciseId;
    private Integer sets;
    private Integer repetitions;
    private Double weight;
    
}
