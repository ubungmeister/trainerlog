package com.trainerlog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "session_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionExercise {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private TrainingSession trainingSession;

    @ManyToOne
    private ClientExercise clientExercise;

    private Integer sets;
    private Integer reps;
    private Double weight;

    // Additional fields can be added as needed, e.g., rest time, notes, etc.

}
