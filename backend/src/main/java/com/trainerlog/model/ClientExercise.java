package com.trainerlog.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Entity
@Table(name = "client_exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientExercise {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;


}
