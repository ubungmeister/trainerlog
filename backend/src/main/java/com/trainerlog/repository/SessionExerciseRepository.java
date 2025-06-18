package com.trainerlog.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.trainerlog.model.SessionExercise;

import java.util.List;
import java.util.UUID;
@Repository
public interface SessionExerciseRepository extends JpaRepository<SessionExercise, UUID> {

    boolean existsByTrainingSession_IdAndExercise_Id(UUID trainingSessionId, UUID exerciseId);
    List<SessionExercise> findAllByTrainingSession_Client_Id(UUID clientId);
    
    // Additional query methods can be defined here if needed
 
}
