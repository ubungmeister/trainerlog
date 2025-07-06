package com.trainerlog.service.client_exercise;
import com.trainerlog.dto.client_exercise.ClientExerciseRequestDto;
import com.trainerlog.dto.client_exercise.ClientExerciseResponseDto;
import com.trainerlog.repository.ClientExerciseRepository;
import com.trainerlog.repository.ExerciseRepository;
import com.trainerlog.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.trainerlog.model.Category;
import com.trainerlog.model.ClientExercise;
import com.trainerlog.model.User;
import com.trainerlog.model.Exercise;
import java.util.UUID;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.trainerlog.repository.CategoryRepository;
@Service
@AllArgsConstructor
 public class ClientExerciseServiceImpl implements ClientExerciseService {
    
    private static final Logger log = LoggerFactory.getLogger(ClientExerciseServiceImpl.class);

    private final ClientExerciseRepository clientExerciseRepository;
    private final CategoryRepository categoryRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    // Helper method to get the client by ID and handle not found cases
    private User getClientById(UUID  clientId) {
        return userRepository.findById(clientId)
            .orElseThrow(() -> {
                log.error("Client with id={} not found", clientId);
                return new RuntimeException("Client not found");
            });
    }
    // Helper method to check if the trainer is authorized to manage the client
    private boolean isTrainerAuthorized(UUID trainerId, User client) {
        return client.getTrainer() != null && client.getTrainer().getId().equals(trainerId);
    }

    //Helper method to get client exercise for a specific client
    ClientExercise findByIdAndClient_Id(UUID id, UUID clientId) {
    return clientExerciseRepository.findByIdAndClient_Id(id, clientId);
    }


    /**
     * Creates a new client exercise associated with a trainer.
     *
     * @param clientExercise  The client exercise creation request data
     * @param trainerId The UUID of the trainer creating the exercise
     * @return ClientExerciseResponseDto containing the created exercise's information
     */

    
    @Override
    public ClientExerciseResponseDto createClientExercise(ClientExerciseRequestDto clientExercise, UUID trainerId) {
        log.info("Attempting to create client exercise for trainerId={}, clientExercise={}", trainerId, clientExercise);

        // Check if the client exists
        User client = getClientById(clientExercise.getClientId());

        // Check if the trainer has permission to create exercises for this client
        if (!isTrainerAuthorized(trainerId, client)) {
            log.error("Trainer with id={} is not authorized to create exercises for client with id={}", trainerId, clientExercise.getClientId());
            throw new RuntimeException("Trainer not authorized to create exercises for this client");
        }
        // Check if in the req has an exerciseId and name at the same time
        if (clientExercise.getExerciseId() != null && clientExercise.getName() != null) {
            log.error("Cannot specify both exerciseId and name in the request");
            throw new IllegalArgumentException("Cannot specify both exerciseId and name in the request");
        }
         // Check if the category exists for the trainer
         Category category = null;
         log.info("Get Category", (clientExercise.getCategoryId()));

        if (clientExercise.getCategoryId() != null) {
                category = categoryRepository.findByIdAndCreatedByTrainer_Id(clientExercise.getCategoryId(), trainerId)
                .orElseThrow(() -> {
                       log.error("Category with id={} not found for trainerId={}", clientExercise.getCategoryId(), trainerId);
                       return new RuntimeException("Category not found");
                });
        }


        // Check if the exercise already exists for the trainer
        if (clientExercise.getExerciseId() != null) {
            log.info("Creating client exercise with existing exerciseId={}", clientExercise.getExerciseId());
            // Fetch the existing exercise by ID
            Exercise exercise = exerciseRepository.findById(clientExercise.getExerciseId())
            .orElseThrow(() -> new RuntimeException("Exercise not found"));

            exercise.setCategory(category); // Set the category if provided

            // Create the ClientExercise entity 
            ClientExercise newClientExercise = ClientExercise.builder()
            .client(client)
            .exercise(exercise)
            .build();
            log.info("Client exercise created successfully with existing exerciseId={}", clientExercise.getExerciseId());
            
            ClientExercise saved = clientExerciseRepository.save(newClientExercise);
            return ClientExerciseResponseDto.fromEntity(saved);

        }
        // If no exerciseId is provided, create a new exercise
        else if (clientExercise.getName() != null) {
            log.info("Creating client exercise with new exercise name={}", clientExercise.getName());
            // Check if the exercise with this name already exists for the trainer
            if (exerciseRepository.existsByNameAndCreatedByTrainer_Id(clientExercise.getName(), trainerId)) {
                log.error("Exercise with name={} already exists for trainerId={}", clientExercise.getName(), trainerId);
                throw new IllegalArgumentException("Exercise with this name already exists for this trainer");
            }
              
            // Create a new Exercise entity
            Exercise newExercise = Exercise.builder()
                .name(clientExercise.getName())
                .category(category)
                .sharedExercise(false) //New exercise that belong to this client only 
                .createdByTrainer(userRepository.findById(trainerId)
                    .orElseThrow(() -> {
                        log.error("Trainer with id={} not found", trainerId);
                        return new RuntimeException("Trainer not found");
                    }))
                .build();

            // Save the new exercise
            Exercise savedExercise = exerciseRepository.save(newExercise);

            // Create the ClientExercise entity
            ClientExercise newClientExercise = ClientExercise.builder()
                .client(client)
                .exercise(savedExercise)
                .build();

            log.info("Client exercise created successfully with new exercise name={}", clientExercise.getName());
            ClientExercise saved = clientExerciseRepository.save(newClientExercise);
            return ClientExerciseResponseDto.fromEntity(saved);
        }
        // If neither exerciseId nor name is provided, throw an error
        else {
            log.error("Either exerciseId or name must be provided in the request");
            throw new IllegalArgumentException("Either exerciseId or name must be provided in the request");
        }
    }

    /**
     * Updates an existing client exercise's active state.
     *
     * @param id The UUID of the client exercise to update
     * @param clientExercise The client exercise update request data
     * @param trainerId The UUID of the trainer performing the update
     * @return ClientExerciseResponseDto containing the updated exercise's information
     */

    @Override
    public ClientExerciseResponseDto updateClientExercise(UUID id, ClientExerciseRequestDto clientExercise, UUID trainerId) {
        log.info("Attempting to update client exercise for trainerId={}, clientExercise={}", trainerId, clientExercise);
         // Check if the client exists
        User client = getClientById(clientExercise.getClientId());

        // Check if the client exercise exists for the given client
        ClientExercise existingClientExercise = findByIdAndClient_Id(id, client.getId());
        if (existingClientExercise == null) {
            log.error("Client exercise with id={} not found for client with id={}", id, client.getId());
            throw new RuntimeException("Client exercise not found for this client");
        }

        // Check if the trainer has permission to update exercises for this client
        if (!isTrainerAuthorized(trainerId, client)) {
            log.error("Trainer with id={} is not authorized to update exercises for client with id={}", trainerId, clientExercise.getClientId());
            throw new RuntimeException("Trainer not authorized to update exercises for this client");
        }

        // Update the active state of the client exercise only!
        if( clientExercise.isActiveClientExercise() != existingClientExercise.isActiveClientExercise()) {
            existingClientExercise.setActiveClientExercise(clientExercise.isActiveClientExercise());
            ClientExercise updated = clientExerciseRepository.save(existingClientExercise);
            return ClientExerciseResponseDto.fromEntity(updated);
        } else {
            throw new IllegalArgumentException("No changes detected in the active state of the client exercise");
        }
      
    }

    /**
     * Deletes a client exercise by its ID for a specific client.
     *
     * @param id The UUID of the client exercise to delete
     * @param trainerId The UUID of the trainer performing the deletion
     * @param clientId The UUID of the client whose exercise is being deleted
     */

    @Override
    public void deleteClientExercise(UUID id, UUID trainerId, UUID clientId) {
        log.info("Attempting to delete client exercise with id={} for trainerId={} and clientId={}", id, trainerId, clientId);

        // Check if the client exists
        User client = getClientById(clientId);

        // Check if the trainer has permission to delete exercises for this client
        if (!isTrainerAuthorized(trainerId, client)) {
            log.error("Trainer with id={} is not authorized to delete exercises for client with id={}", trainerId, clientId);
            throw new RuntimeException("Trainer not authorized to delete exercises for this client");
        }

        // Find the client exercise by ID and client ID
        ClientExercise existingClientExercise = findByIdAndClient_Id(id, client.getId());
        if (existingClientExercise == null) {
            log.error("Client exercise with id={} not found for client with id={}", id, client.getId());
            throw new RuntimeException("Client exercise not found for this client");
        }

        // Delete the client exercise
        clientExerciseRepository.delete(existingClientExercise);
        log.info("Client exercise with id={} deleted successfully", id);
    }

    /**
     * Retrieves all client exercises for a specific client.
     *
     * @param clientId The UUID of the client whose exercises are to be retrieved
     * @param trainerId The UUID of the trainer requesting the exercises
     * @return List of ClientExerciseResponseDto containing the client's exercises
     */

    @Override
    public List<ClientExerciseResponseDto> getAllClientExercises(UUID clientId, UUID trainerId) {
        log.info("Fetching all client exercises for clientId={} and trainerId={}", clientId, trainerId);

        // Check if the client exists
        User client = getClientById(clientId);

        // Check if the trainer has permission to view exercises for this client
        if (!isTrainerAuthorized(trainerId, client)) {
            log.error("Trainer with id={} is not authorized to view exercises for client with id={}", trainerId, clientId);
            throw new RuntimeException("Trainer not authorized to view exercises for this client");
        }

        // Fetch all client exercises for the given client  
        List<ClientExercise> clientExercises = clientExerciseRepository.findAllByClient_Id(client.getId());
        
        return clientExercises.stream()
            .map(ClientExerciseResponseDto::fromEntity)
            .toList();
    }

    /**
     * Retrieves a specific client exercise by its ID for a specific client.
     *
     * @param id The UUID of the client exercise to retrieve
     * @param clientId The UUID of the client whose exercise is being retrieved
     * @param trainerId The UUID of the trainer requesting the exercise
     * @return ClientExerciseResponseDto containing the requested exercise's information
     */

    @Override
    public ClientExerciseResponseDto getClientExerciseById(UUID id, UUID clientId, UUID trainerId) {
        log.info("Fetching client exercise by id={} for clientId={} and trainerId={}", id, clientId, trainerId);

        // Check if the client exists
        User client = getClientById(clientId);

        // Check if the trainer has permission to view exercise for this client
        if (!isTrainerAuthorized(trainerId, client)) {
            log.error("Trainer with id={} is not authorized to view exercises for client with id={}", trainerId, clientId);
            throw new RuntimeException("Trainer not authorized to view exercises for this client");
        }

        // Find the client exercise by ID and client ID
        ClientExercise existingClientExercise = findByIdAndClient_Id(id, client.getId());
        if (existingClientExercise == null) {
            log.error("Client exercise with id={} not found for client with id={}", id, client.getId());
            throw new RuntimeException("Client exercise not found for this client");
        }
        log.info("Client exercise with id={} found for client with id={}", id, client.getId());
        return ClientExerciseResponseDto.fromEntity(existingClientExercise);
        
    }
}
