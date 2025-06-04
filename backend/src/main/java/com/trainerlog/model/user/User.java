package com.trainerlog.model.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String email;

    private String fullName;

    @JsonIgnore // 👈 don't return password
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // client belongs to the trainer -> no serialization back
    @ManyToOne
    @JoinColumn(name = "trainer_id")
    // doesn't include trainer id to the response (because of the recusrsion)
    @JsonBackReference
    private User trainer;

    //if trainer -> has clients
    @OneToMany(mappedBy = "trainer")
    @JsonManagedReference
    private List<User> clients = new ArrayList<>();

    public enum Role {
        TRAINER,
        CLIENT
    }
}
