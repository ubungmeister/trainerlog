package com.trainerlog.service.exercise;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.trainerlog.dto.exercise.ExerciseRequestDto;
import com.trainerlog.dto.exercise.ExerciseResponseDto;
import java.util.UUID;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.repository.ExerciseRepository;
import com.trainerlog.model.Exercise;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@AllArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private static final Logger log = LoggerFactory.getLogger(ExerciseServiceImpl.class);


    /**
     * Creates a new exercise associated with a trainer.
     *
     * @param dto The exercise creation request data
     * @param trainerId The UUID of the trainer creating the exercise
     * @return ExerciseResponseDto containing the created exercise's information
     */

    @Override
    public ExerciseResponseDto createExercise(ExerciseRequestDto dto, UUID trainerId) {
       log.info("Attempting to create exercise for trainerId={}, name={}", trainerId, dto.getName());
       if (exerciseRepository.existsByNameAndCreatedByTrainer_Id(dto.getName(), trainerId)) {
            log.error("Exercise with name={} already exists for trainerId={}", dto.getName(), trainerId);
             throw new IllegalArgumentException("Exercise with this name already exists for this trainer");
            }
        
        Exercise exercise = Exercise.builder()
                .name(dto.getName())
                .createdByTrainer(userRepository.findById(trainerId)
                        .orElseThrow(() -> {
                            log.error("Trainer with id={} not found", trainerId);
                            return new RuntimeException("Trainer not found");
                        }))
                .build();
        try{
            Exercise savedExercise = exerciseRepository.save(exercise);
            log.info("Exercise created successfully with id={}", savedExercise.getId());
            return ExerciseResponseDto.fromEntity(savedExercise);
        } catch (Exception e) {
            log.error("Error saving exercise: {}", e.getMessage());
            throw new RuntimeException("Error saving exercise: " + e.getMessage());
        }
    }

    /**
     * Updates an existing exercise's information.
     *
     * @param dto The exercise update request data
     * @param trainerId The UUID of the trainer performing the update
     * @return ExerciseResponseDto containing the updated exercise's information
     */

    @Override
    public ExerciseResponseDto updateExercise(UUID id,ExerciseRequestDto dto, UUID trainerId) {
        log.info("Attempting to update exercise with id={} for trainerId={}", id, trainerId);
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Exercise with id={} not found for trainerId={}", id, trainerId);
                    return new RuntimeException("Exercise not found");
                });
        
        if (!exercise.getCreatedByTrainer().getId().equals(trainerId)) {
            log.error("Unauthorized update attempt for exercise id={} by trainer id={}", id, trainerId);
            throw new IllegalArgumentException("You are not authorized to update this exercise");
        }
        
        if (!exercise.getName().equals(dto.getName()) && exerciseRepository.existsByNameAndCreatedByTrainer_Id(dto.getName(), trainerId)) {
            log.error("Exercise with name={} already exists for trainerId={}", dto.getName(), trainerId);
            throw new IllegalArgumentException("Exercise with this name already exists for this trainer");
        }
        
        exercise.setName(dto.getName());
        
        try {
            Exercise updatedExercise = exerciseRepository.save(exercise);
            log.info("Exercise updated successfully with id={}", updatedExercise.getId());
            return ExerciseResponseDto.fromEntity(updatedExercise);
        } catch (Exception e) {
            log.error("Error updating exercise: {}", e.getMessage());
            throw new RuntimeException("Error updating exercise: " + e.getMessage());
        }
    }

    /**
     * Deletes an exercise by its ID if it exists and is associated with the trainer.
     *
     * @param id The UUID of the exercise to delete
     * @param trainerId The UUID of the trainer who owns the exercise
     */

    @Override
    public void deleteExercise(UUID id, UUID trainerId) {
        log.info("Attempting to delete exercise with id={} for trainerId={}", id, trainerId);
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Exercise with id={} not found for trainerId={}", id, trainerId);
                    return new RuntimeException("Exercise not found");
                });
        
        if (!exercise.getCreatedByTrainer().getId().equals(trainerId)) {
            log.error("Unauthorized deletion attempt for exercise id={} by trainer id={}", id, trainerId);
            throw new IllegalArgumentException("This exercise does not belong to the trainer");
        }
        
        log.info("Deleting exercise with id={} for trainerId={}", id, trainerId);
        exerciseRepository.delete(exercise);
    }

    /**
     * Retrieves all exercises associated with a trainer.
     *
     * @param trainerId The UUID of the trainer whose exercises are to be retrieved
     * @return List of ExerciseResponseDto containing all exercises for the trainer
     */
    @Override
    public List<ExerciseResponseDto> getAllExercises(UUID trainerId) {
        log.info("Retrieving all exercises for trainerId={}", trainerId);
        if (!userRepository.existsById(trainerId)) {
            log.error("Trainer with id={} not found", trainerId);
            throw new RuntimeException("T   rainer not found");
        }
        
        List<Exercise> exercises = exerciseRepository.findByCreatedByTrainer_Id(trainerId);
        return exercises.stream()
                .map(ExerciseResponseDto::fromEntity)
                .toList();
    }

    
}
