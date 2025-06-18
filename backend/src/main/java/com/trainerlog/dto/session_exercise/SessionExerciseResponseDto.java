
package com.trainerlog.dto.session_exercise;
import com.trainerlog.model.SessionExercise;
import lombok.Data;

@Data
public class SessionExerciseResponseDto {

    private String id;
    private String trainingSessionId;
    private String exerciseId;
    private String exerciseName;
    private Integer sets;
    private Integer repetitions;
    private Double weight;

    public SessionExerciseResponseDto(String id, String trainingSessionId, String exerciseId, String exerciseName,
                                      Integer sets, Integer repetitions, Double weight) {
        this.id = id;
        this.trainingSessionId = trainingSessionId;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.sets = sets;
        this.repetitions = repetitions;
        this.weight = weight;
    }

    public static SessionExerciseResponseDto fromEntity(SessionExercise sessionExercise) {
        return new SessionExerciseResponseDto(
                sessionExercise.getId().toString(),
                sessionExercise.getTrainingSession().getId().toString(),
                sessionExercise.getExercise().getId().toString(),
                sessionExercise.getExercise().getName(),
                sessionExercise.getSets(),
                sessionExercise.getRepetitions(),
                sessionExercise.getWeight()
        );
    }

    
}