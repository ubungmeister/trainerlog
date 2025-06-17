package com.trainerlog.dto.training_session;
import com.trainerlog.model.TrainingSession;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TrainingSessionResponseDto {

    private String id;
    private String clientId;
    private LocalDateTime date;

    public TrainingSessionResponseDto(String id, String clientId, LocalDateTime date) {
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
