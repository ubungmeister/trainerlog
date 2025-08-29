package com.trainerlog.service.training_session;
import lombok.AllArgsConstructor;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.trainerlog.dto.training_session.TrainingSessionRequestDto;
import com.trainerlog.dto.training_session.TrainingSessionResponseDto;
import com.trainerlog.exception.DuplicateSessionException;
import com.trainerlog.model.TrainingSession;
import com.trainerlog.model.User;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.repository.TrainingSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
 import java.util.List;
@Service
@AllArgsConstructor
public class TrainingSessionServiceImpl implements TrainingSessionService {

    private final UserRepository userRepository;
    private final TrainingSessionRepository trainingSessionRepository;

    private static final Logger log = LoggerFactory.getLogger(TrainingSessionServiceImpl.class);

       // Helper method to check if the trainer is authorized to manage the client
    private boolean isTrainerAuthorized(UUID trainerId, User client) {
        return client.getTrainer() != null && client.getTrainer().getId().equals(trainerId);
    }
        //Helper method for gettig Client 
    private User getClientById(UUID clientId) {
        return userRepository.findById(clientId)
                .orElseThrow(() -> {
                    log.error("Client with id={} not found", clientId);
                    return new RuntimeException("Client not found");
                });
    }
    private User getAuthorizedClient(UUID clientId, UUID trainerId){
        User client = getClientById(clientId);
        if (!isTrainerAuthorized(trainerId, client)) {
            log.error("Trainer with id={} is not authorized to access client with id={}", trainerId, clientId);
            throw new RuntimeException("Trainer not authorized to access this client");
        }
        return client;
    }

    // Helper method to retrieve an existing training session by ID
    private TrainingSession getExistingTrainingSession(UUID sessionId){
        return trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    log.error("Training session with id={} not found", sessionId);
                    return new RuntimeException("Training session not found");
                });

    }
    // Helper method to check if the training session belongs to the specified client
    
      private TrainingSession getClientTrainingSession(UUID clientId, UUID sessionId) {

        TrainingSession existingTrainingSession = getExistingTrainingSession(sessionId);

         if (!existingTrainingSession.getClient().getId().equals(clientId)) {
            log.error("Training session with id={} does not belong to client with id={}", sessionId, clientId);
            throw new RuntimeException("Training session does not belong to the specified client");
        }
        return existingTrainingSession;
      }


 
    /**
     * Creates a new training session for a client.
     *
     * @param trainingSessionRequestDto The request data for creating the training session
     * @param trainerId The UUID of the trainer creating the session
     * @return TrainingSessionResponseDto containing the created training session's information
     */

    @Override
    public TrainingSessionResponseDto createTrainingSession (TrainingSessionRequestDto trainingSessionRequestDto, UUID trainerId) {
        log.info("Attempting to create training session for clientId={}, trainerId={}", trainingSessionRequestDto.getClientId(), trainerId);

        User client = getAuthorizedClient(trainingSessionRequestDto.getClientId(), trainerId);

        //Check if a training session for the same client on the same date already exists
        if (trainingSessionRepository.existsByClient_IdAndDate(client.getId(), trainingSessionRequestDto.getDate())) {
            log.error("Training session for clientId={} on date={} already exists", client.getId(), trainingSessionRequestDto.getDate());
            throw new DuplicateSessionException("Training session already exists for this client and date");

        }
        TrainingSession newTrainingSession = TrainingSession.builder()
                .client(client)
                .date(trainingSessionRequestDto.getDate())
                .build();
        log.info("Creating training session for client with id={}", trainingSessionRequestDto.getClientId());

        TrainingSession savedTrainingSession = trainingSessionRepository.save(newTrainingSession);
        return TrainingSessionResponseDto.fromEntity(savedTrainingSession);
    }

    /**
     * Updates an existing training session for a client.
     *
     * @param trainingSessionRequestDto The request data for updating the training session
     * @param trainerId The UUID of the trainer updating the session
     * @param sessionId The UUID of the training session to update
     * @return TrainingSessionResponseDto containing the updated training session's information
     */

    @Override
    public TrainingSessionResponseDto updateTrainingSession(TrainingSessionRequestDto trainingSessionRequestDto, UUID trainerId, UUID sessionId) {
        log.info("Attempting to update training session with id={} for trainerId={}", sessionId, trainerId);

        getAuthorizedClient(trainingSessionRequestDto.getClientId(), trainerId);

        TrainingSession existingTrainingSession =  getClientTrainingSession(trainingSessionRequestDto.getClientId(), sessionId);

        // updating the date of the existing training session
        existingTrainingSession.setDate(trainingSessionRequestDto.getDate());

        return TrainingSessionResponseDto.fromEntity(trainingSessionRepository.save(existingTrainingSession));
    }

    /**
     * Deletes a training session for a client.
     *
     * @param clientId The UUID of the client whose session is being deleted
     * @param trainerId The UUID of the trainer performing the deletion
     * @param sessionId The UUID of the training session to delete
     */

    @Override
    public void deleteTrainingSession(UUID clientId, UUID trainerId, UUID sessionId) {
        log.info("Attempting to delete training session with id={} for clientId={} and trainerId={}", sessionId, clientId, trainerId);

       
        getAuthorizedClient(clientId, trainerId);

        TrainingSession existingTrainingSession =  getClientTrainingSession(clientId, sessionId);

        trainingSessionRepository.delete(existingTrainingSession);
    }

    /**
     * Retrieves a training session by its ID for a specific client and trainer.
     *
     * @param sessionId The UUID of the training session to retrieve
     * @param clientId The UUID of the client whose session is being retrieved
     * @param trainerId The UUID of the trainer performing the retrieval
     * @return TrainingSessionResponseDto containing the training session's information
     */

    @Override
    public TrainingSessionResponseDto getTrainingSessionById(UUID sessionId, UUID clientId, UUID trainerId) {
        log.info("Attempting to retrieve training session with id={} for clientId={} and trainerId={}", sessionId, clientId, trainerId);

       
        getAuthorizedClient(clientId, trainerId);

        TrainingSession existingTrainingSession =  getClientTrainingSession(clientId, sessionId);

        return TrainingSessionResponseDto.fromEntity(existingTrainingSession);
    }

    /**
     * Retrieves all training sessions for a specific client and trainer.
     *
     * @param clientId The UUID of the client whose sessions are being retrieved
     * @param trainerId The UUID of the trainer performing the retrieval
     * @return List of TrainingSessionResponseDto containing all training sessions for the client
     */

    @Override
    public List<TrainingSessionResponseDto> getAllTrainingSessions(UUID clientId, UUID trainerId,LocalDate startDate, LocalDate endDate) {

        log.info("Attempting to retrieve all training sessions for clientId={} and trainerId={}", clientId, trainerId);

        getAuthorizedClient(clientId, trainerId);

        List<TrainingSession> trainingSessions;

        trainingSessions = trainingSessionRepository.findByClient_IdAndDateGreaterThanEqualAndDateLessThanEqual( clientId, startDate, endDate);

        log.info("Found {} training sessions for clientId={}", trainingSessions.size(), clientId);
    
         return trainingSessions.stream()
            .map(TrainingSessionResponseDto::fromEntity)
            .collect(Collectors.toList());

    }
       
}
