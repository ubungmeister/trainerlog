package com.trainerlog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.*; 


@Entity
@Table(name = "training_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingSession {
    @Id
    @GeneratedValue
    private UUID id;

    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    @OneToMany(mappedBy = "trainingSession", cascade = CascadeType.ALL)
    private List<SessionExercise> sessionExercises = new ArrayList<>();

}
