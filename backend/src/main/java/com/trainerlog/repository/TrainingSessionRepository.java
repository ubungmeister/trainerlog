package com.trainerlog.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trainerlog.model.TrainingSession;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID>{

    List<TrainingSession> findAllByClient_Id(UUID clientId);

    List<TrainingSession> findByClient_IdAndDateGreaterThanEqualAndDateLessThanEqual(
        UUID clientId, LocalDate start, LocalDate end);

    boolean existsByClient_IdAndDate(UUID clientId, LocalDate date);

    Optional<TrainingSession> findByClient_IdAndDate(UUID clientId, LocalDate date);
    
}
