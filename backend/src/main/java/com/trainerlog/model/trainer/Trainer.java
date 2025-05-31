package com.trainerlog.model.trainer;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "trainers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trainer {

    @Id 
    @GeneratedValue
    private UUID id;

    private String fullName;

    private String email;
}
