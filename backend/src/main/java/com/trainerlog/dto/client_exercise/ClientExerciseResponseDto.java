package com.trainerlog.dto.client_exercise;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import com.trainerlog.model.ClientExercise;


@Data
@NoArgsConstructor

public class ClientExerciseResponseDto {

    private UUID id;
    private boolean activeClientExercise;

    @NotNull(message = "Client ID is required")
    private UUID clientId;

    @NotNull(message = "Exercise ID is required")
    private UUID exerciseId;

    private String exerciseName;

    public ClientExerciseResponseDto(UUID id, String exerciseName, boolean activeClientExercise, UUID clientId, UUID exerciseId) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.activeClientExercise = activeClientExercise; 
        this.clientId = clientId;
        this.exerciseId = exerciseId;     
    }
    public static ClientExerciseResponseDto fromEntity(ClientExercise clientExercise) {
        return new ClientExerciseResponseDto(
            clientExercise.getId(),
            clientExercise.getExercise().getName(),
            clientExercise.isActiveClientExercise(),
            clientExercise.getClient().getId(),
            clientExercise.getExercise().getId()
        );
    }

}