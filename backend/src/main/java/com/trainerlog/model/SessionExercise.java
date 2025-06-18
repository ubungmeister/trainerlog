package com.trainerlog.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "session_exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionExercise {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private TrainingSession trainingSession;

    @ManyToOne
    private Exercise exercise;

    
    private Integer sets; 
    private Integer repetitions;
    private Double weight;

    // Additional fields can be added as needed, e.g., rest time, notes, etc.

}
