package com.trainerlog.dto.session_exercise;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddExerciseEntryRequestDto {

    private UUID clientId;
    private LocalDate date;
    private UUID exerciseId;
    private Integer sets;
    private Integer repetitions;
    private Double weight;

}
