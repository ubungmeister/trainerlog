package com.trainerlog.dto.training_session;

import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;


@Data
@NoArgsConstructor
public class TrainingSessionRequestDto {
     
    @NotNull
    private UUID clientId;
    private LocalDate date;

}
