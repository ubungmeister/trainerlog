package com.trainerlog.dto.training_session;
import com.trainerlog.model.TrainingSession;
import java.time.LocalDate;

import lombok.Data;

@Data
public class TrainingSessionResponseDto {

    private String id;
    private String clientId;
    private LocalDate date;

    public TrainingSessionResponseDto(String id, String clientId, LocalDate date) {
        this.id = id;
        this.clientId = clientId;
        this.date = date;
    }

    public static TrainingSessionResponseDto fromEntity(TrainingSession trainingSession) {
        return new TrainingSessionResponseDto(
                trainingSession.getId().toString(),
                trainingSession.getClient().getId().toString(),
                trainingSession.getDate()
        );
    }

    
}
