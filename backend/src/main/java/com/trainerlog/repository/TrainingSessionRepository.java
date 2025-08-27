package com.trainerlog.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trainerlog.model.TrainingSession;

import org.springframework.stereotype.Repository;


@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID>{

    List<TrainingSession> findAllByClient_Id(UUID clientId);

      // Find sessions before a specific date
    List<TrainingSession> findTop20ByClientIdAndDateLessThanOrderByDateDesc(
        UUID clientId, LocalDateTime beforeDate);
    
    // Find most recent sessions
    List<TrainingSession> findTop20ByClientIdOrderByDateDesc(
        UUID clientId);

    
}
