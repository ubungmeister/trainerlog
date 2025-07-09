package com.trainerlog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.util.UUID;

@Entity
@Table(name = "exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {
    @Id
    @GeneratedValue
    private UUID id;

    @Builder.Default
    @Column(nullable = false)
    private boolean activeExercise = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean sharedExercise = false;

    @Column 
    private String name;

    @ManyToOne
    @JoinColumn(name = "created_by_trainer_id")
    private User createdByTrainer;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

}

