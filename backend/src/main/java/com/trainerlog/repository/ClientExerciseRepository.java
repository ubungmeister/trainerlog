package com.trainerlog.repository;
import com.trainerlog.model.ClientExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClientExerciseRepository extends JpaRepository<ClientExercise, UUID> {

    ClientExercise findByIdAndClient_Id(UUID id, UUID clientId);
    List<ClientExercise> findAllByClient_Id(UUID clientId);

    
}
