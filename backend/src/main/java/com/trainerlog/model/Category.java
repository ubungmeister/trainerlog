package com.trainerlog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue
    private UUID id;
    
   @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "created_by_trainer_id")
    private User createdByTrainer;

       

}

 