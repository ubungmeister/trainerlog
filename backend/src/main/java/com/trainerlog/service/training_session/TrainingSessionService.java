package com.trainerlog.service.training_session;

import java.util.UUID;

 
import java.time.LocalDate;
import java.util.List;
import com.trainerlog.dto.training_session.TrainingSessionRequestDto;
import com.trainerlog.dto.training_session.TrainingSessionResponseDto;

public interface TrainingSessionService {
    public TrainingSessionResponseDto createTrainingSession(TrainingSessionRequestDto trainingSessionRequestDto, UUID trainerId);
    public TrainingSessionResponseDto updateTrainingSession(TrainingSessionRequestDto trainingSessionRequestDto, UUID trainerId, UUID sessionId);
    public void deleteTrainingSession(UUID clientId, UUID trainerId, UUID sessionId);
    public TrainingSessionResponseDto getTrainingSessionById(UUID sessionId, UUID clientId, UUID trainerId);
    public List<TrainingSessionResponseDto> getAllTrainingSessions(UUID clientId, UUID trainerId,LocalDate startDate, LocalDate endDate);
}
