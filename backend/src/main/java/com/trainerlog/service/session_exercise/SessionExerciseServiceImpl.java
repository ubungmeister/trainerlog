package com.trainerlog.service.session_exercise;
import com.trainerlog.dto.session_exercise.AddExerciseEntryRequestDto;
import com.trainerlog.dto.session_exercise.SessionExerciseRequestDto;
import com.trainerlog.dto.session_exercise.SessionExerciseResponseDto;
import com.trainerlog.model.Exercise;
import com.trainerlog.model.SessionExercise;
import com.trainerlog.model.TrainingSession;
import com.trainerlog.model.User;
import com.trainerlog.repository.TrainingSessionRepository;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.repository.ClientExerciseRepository;
import com.trainerlog.repository.ExerciseRepository;
import com.trainerlog.repository.SessionExerciseRepository;

import lombok.AllArgsConstructor;
import java.util.UUID;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
public class SessionExerciseServiceImpl implements SessionExerciseService {

    
    private final UserRepository userRepository;
    private final TrainingSessionRepository trainingSessionRepository;
    private final ExerciseRepository exerciseRepository;
    private final SessionExerciseRepository sessionExerciseRepository;
    private final ClientExerciseRepository clientExerciseRepository;
    private static final Logger log = LoggerFactory.getLogger(SessionExerciseServiceImpl.class);


    // Helper method to check if the trainer is authorized to manage the client
    private void checkTrainerAuthorization(UUID trainerId, User client) {
        if (client.getTrainer() == null || !client.getTrainer().getId().equals(trainerId)) {
        log.error("Trainer with id={} is not authorized for client with id={}", trainerId, client.getId());
        throw new RuntimeException("Trainer not authorized");
        }
    }
    
    private TrainingSession getSessionById(UUID sessionId) {
        return trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> {
                    log.error("Training session with id={} not found", sessionId);
                    return new RuntimeException("Training session not found");
                });
    }
    private Exercise getExerciseById(UUID exerciseId) {
        return exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> {
                    log.error("Exercise with id={} not found", exerciseId);
                    return new RuntimeException("Exercise not found");
                });
    }

    private SessionExercise getSessionExerciseById(UUID sessionExerciseId) {
        return sessionExerciseRepository.findById(sessionExerciseId)
                .orElseThrow(() -> {
                    log.error("Session exercise with id={} not found", sessionExerciseId);
                    return new RuntimeException("Session exercise not found");
                });
    }

     
     /**
     * Creates a new session exercise for a training session.
     * @param sessionExerciseRequestDto the request DTO containing session exercise details
     * @param trainerId the ID of the trainer creating the session exercise
     * @return SessionExerciseResponseDto containing the created session exercise's information
     */
    @Override
    public SessionExerciseResponseDto createSessionExercise(SessionExerciseRequestDto sessionExerciseRequestDto, UUID trainerId) {

        TrainingSession session = getSessionById(sessionExerciseRequestDto.getTrainingSessionId());
        
        User client = session.getClient();

        checkTrainerAuthorization(trainerId, client);

        
    
        Exercise exercise = getExerciseById(sessionExerciseRequestDto.getExerciseId());

        //Check if  on the list of client's exercises is the exercise with the given id
        if (!clientExerciseRepository.existsByClient_IdAndExercise_Id(client.getId(), exercise.getId())) {
            log.error("Exercise with id={} is not in the client's exercise list", exercise.getId());
            throw new RuntimeException("Exercise not found in client's exercise list");
        }
      
        // Check if some of the training session has the same id and exercise id
        //Prevents duplicate session exercises for the same training session and exercise
        if (sessionExerciseRepository.existsByTrainingSession_IdAndExercise_Id(sessionExerciseRequestDto.getTrainingSessionId(), sessionExerciseRequestDto.getExerciseId())) {
            log.error("Session exercise with training session id={} and exercise id={} already exists", session.getId(), exercise.getId());
            throw new RuntimeException("Session exercise already exists for this training session and exercise");
        }

        SessionExercise  sessionExercise = SessionExercise.builder()
                .trainingSession(session)
                .exercise(exercise)
                .sets(sessionExerciseRequestDto.getSets())
                .repetitions(sessionExerciseRequestDto.getRepetitions())
                .weight(sessionExerciseRequestDto.getWeight())
                .build();

        SessionExercise savedSessionExercise = sessionExerciseRepository.save(sessionExercise);
        log.info("Session exercise created with id={}", savedSessionExercise.getId());

        return SessionExerciseResponseDto.fromEntity(savedSessionExercise);
    }

    /**
     * Updates an existing session exercise.
     * @param id the ID of the session exercise to update
     * @param sessionExerciseRequestDto the request DTO containing updated session exercise details
     * @param trainerId the ID of the trainer updating the session exercise
     * @return SessionExerciseResponseDto containing the updated session exercise's information
     */

    @Override
    public SessionExerciseResponseDto updateSessionExercise(UUID id, SessionExerciseRequestDto sessionExerciseRequestDto, UUID trainerId) {
        
        SessionExercise sessionExercise = getSessionExerciseById(id);
        TrainingSession session = sessionExercise.getTrainingSession();
        User client = session.getClient();

        checkTrainerAuthorization(trainerId, client);

        // Update the fields of the session exercise
        sessionExercise.setSets(sessionExerciseRequestDto.getSets());
        sessionExercise.setRepetitions(sessionExerciseRequestDto.getRepetitions());
        sessionExercise.setWeight(sessionExerciseRequestDto.getWeight());

        SessionExercise updatedSessionExercise = sessionExerciseRepository.save(sessionExercise);
        log.info("Session exercise updated with id={}", updatedSessionExercise.getId());

        return SessionExerciseResponseDto.fromEntity(updatedSessionExercise);
    }

    /** 
     * Deletes a session exercise by its ID.
     * @param id the ID of the session exercise to delete
     * @param trainerId the ID of the trainer deleting the session exercise
     * @throws RuntimeException if the session exercise does not exist or the trainer is not authorized
     */
    @Override
    public void deleteSessionExercise(UUID id, UUID trainerId) {
        
        SessionExercise sessionExercise = getSessionExerciseById(id);
        TrainingSession session = sessionExercise.getTrainingSession();
        User client = session.getClient();

        checkTrainerAuthorization(trainerId, client);

        sessionExerciseRepository.delete(sessionExercise);
        log.info("Session exercise deleted with id={}", id);
    }

    /**
     * Retrieves a session exercise by its ID.
     * @param id the ID of the session exercise to retrieve
     * @param trainerId the ID of the trainer requesting the session exercise
     * @return SessionExerciseResponseDto containing the session exercise's information
     * @throws RuntimeException if the session exercise does not exist or the trainer is not authorized
     */
    @Override
    public SessionExerciseResponseDto getSessionExerciseById(UUID id, UUID trainerId) {
        
        SessionExercise sessionExercise = getSessionExerciseById(id);
        TrainingSession session = sessionExercise.getTrainingSession();
        User client = session.getClient();

        checkTrainerAuthorization(trainerId, client);

        log.info("Session exercise retrieved with id={}", id);
        return SessionExerciseResponseDto.fromEntity(sessionExercise);
    }

    /**
     * Retrieves all session exercises for a specific client.
     * @param clientId the ID of the client whose session exercises are being retrieved
     * @param trainerId the ID of the trainer requesting the session exercises
     * @return List of SessionExerciseResponseDto containing all session exercises for the client
     * @throws RuntimeException if the client does not exist or the trainer is not authorized
     */
    @Override
    public List<SessionExerciseResponseDto> getAllSessionExercises(UUID clientId, UUID trainerId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> {
                    log.error("Client with id={} not found", clientId);
                    return new RuntimeException("Client not found");
                });

        checkTrainerAuthorization(trainerId, client);

        List<SessionExercise> sessionExercises = sessionExerciseRepository.findAllByTrainingSession_Client_Id(clientId);
        log.info("Retrieved all session exercises for client with id={}", clientId);

        return  sessionExercises.stream()
                .map(SessionExerciseResponseDto::fromEntity)
                .toList();
    }

    /**
     * Adds an exercise entry for a client on a specific date.
     * If a training session for that date does not exist, it creates one first.
     * Then adds the session exercise to that session.
     *
     * @param dto the request DTO containing client, date, exercise, and performance details
     * @param trainerId the ID of the trainer performing the action
     * @return SessionExerciseResponseDto containing the created session exercise
     */
    @Override
    @Transactional
    public SessionExerciseResponseDto addExerciseEntry(AddExerciseEntryRequestDto dto, UUID trainerId) {

        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> {
                    log.error("Client with id={} not found", dto.getClientId());
                    return new RuntimeException("Client not found");
                });

        checkTrainerAuthorization(trainerId, client);

        TrainingSession session = trainingSessionRepository
                .findByClient_IdAndDate(dto.getClientId(), dto.getDate())
                .orElseGet(() -> {
                    log.info("No session found for client={} on date={}, creating new one", dto.getClientId(), dto.getDate());
                    TrainingSession newSession = TrainingSession.builder()
                            .date(dto.getDate())
                            .client(client)
                            .build();
                    return trainingSessionRepository.save(newSession);
                });

        Exercise exercise = getExerciseById(dto.getExerciseId());

        // Check if exercise is in the client's exercise list
        if (!clientExerciseRepository.existsByClient_IdAndExercise_Id(client.getId(), exercise.getId())) {
            log.error("Exercise with id={} is not in the client's exercise list", exercise.getId());
            throw new RuntimeException("Exercise not found in client's exercise list");
        }

        // Check for duplicate session exercise
        if (sessionExerciseRepository.existsByTrainingSession_IdAndExercise_Id(session.getId(), exercise.getId())) {
            log.error("Session exercise already exists for session={} and exercise={}", session.getId(), exercise.getId());
            throw new RuntimeException("Session exercise already exists for this training session and exercise");
        }

        SessionExercise sessionExercise = SessionExercise.builder()
                .trainingSession(session)
                .exercise(exercise)
                .sets(dto.getSets())
                .repetitions(dto.getRepetitions())
                .weight(dto.getWeight())
                .build();

        SessionExercise saved = sessionExerciseRepository.save(sessionExercise);
        log.info("Exercise entry added: sessionExercise={} for session={} on date={}", saved.getId(), session.getId(), dto.getDate());

        return SessionExerciseResponseDto.fromEntity(saved);
    }
    
}
