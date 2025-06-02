package com.trainerlog.model.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // If this user is a client, trainerId points to their trainer
    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;

    // If this user is a trainer, then this is his clients
    @OneToMany(mappedBy = "trainer")
    private List<User> clients = new ArrayList<>();

    public enum Role {
        TRAINER,
        CLIENT
    }
}
