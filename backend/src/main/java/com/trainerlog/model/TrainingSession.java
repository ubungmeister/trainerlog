package com.trainerlog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.*; 



@Entity
@Table(name = "training_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingSession {
    @Id
    @GeneratedValue
    private UUID id;

    private LocalDateTime date;
 

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    //CascadeType.REMOVE - if the training session is deleted, all related session exercises are also delete
    @OneToMany(mappedBy = "trainingSession", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY) 
    private List<SessionExercise> sessionExercises = new ArrayList<>();

}
