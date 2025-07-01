package com.trainerlog.service.category;
import lombok.AllArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.trainerlog.dto.category.CategoryRequestDto;
import com.trainerlog.dto.category.CategoryResponseDto;
import java.util.UUID;
import com.trainerlog.model.Category;
import com.trainerlog.repository.UserRepository;
import com.trainerlog.repository.CategoryRepository;
import java.util.List;
import com.trainerlog.model.Exercise;
import com.trainerlog.repository.ExerciseRepository;
@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private static final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);


    /**
     * Creates a new category associated with a trainer.
     *
     * @param dto The category creation request data
     * @param trainerId The UUID of the trainer creating the category
     * @return CategoryResponseDto containing the created category's information
     */
    
    @Override
    public CategoryResponseDto createCategory(CategoryRequestDto dto, UUID trainerId) {

    log.info("Attempting to create category for trainerId={}, name={}", trainerId, dto.getName());

    // first check if trainer has the category witht the same name 
    if(categoryRepository.existsByNameAndCreatedByTrainer_Id(dto.getName(), trainerId)) {
        log.error("Category with name={} already exists for trainerId={}", dto.getName(), trainerId);
        throw new IllegalArgumentException("Category with this name already exists for this trainer");
    }
    Category category = Category.builder()
            .name(dto.getName())
            .createdByTrainer(userRepository.findById(trainerId)
                    .orElseThrow(() -> {
                        log.error("Trainer with id={} not found", trainerId);
                        return new RuntimeException("Trainer not found");
                    }))
            .build();
    try {
        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with id={}", savedCategory.getId());
        return CategoryResponseDto.fromEntity(savedCategory);

        }catch (Exception e) {
        log.error("Error saving category: {}", e.getMessage());
        throw new RuntimeException("Error saving category: " + e.getMessage());
        }
    }

    /**
     * Updates an existing category's information.
     *
     * @param id The UUID of the category to update
     * @param dto The category update request data
     * @param trainerId The UUID of the trainer updating the category
     * @return CategoryResponseDto containing the updated category's information
     */

    @Override
    public CategoryResponseDto updateCategory(UUID id, CategoryRequestDto dto, UUID trainerId){
    log.info("Attempting to update category with id={} for trainerId={}, new name={}", id, trainerId, dto.getName());
    

    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> {
                log.error("Category with id={} not found", id);
                return new RuntimeException("Category not found");
            });
            
    if(!category.getCreatedByTrainer().getId().equals(trainerId)) {
        log.error("Trainer with id={} does not own category with id={}", trainerId, id);
        throw new IllegalArgumentException("You do not have permission to update this category");
    }

    if(!category.getName().equals(dto.getName()) && categoryRepository.existsByNameAndCreatedByTrainer_Id(dto.getName(), trainerId)) {
        log.error("Category with name={} already exists for trainerId={}", dto.getName(), trainerId);
        throw new IllegalArgumentException("Category with this name already exists for this trainer");
    
    }

    category.setName(dto.getName());
    try{

        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated successfully with id={}", updatedCategory.getId());
        return CategoryResponseDto.fromEntity(updatedCategory);

       }catch (Exception e) {
        log.error("Error updating category: {}", e.getMessage());
        throw new RuntimeException("Error updating category: " + e.getMessage());
       }
    }

    @Override
    public void deleteCategory(UUID id, UUID trainerId) {
    log.info("Attempting to delete category with id={} for trainerId={}", id, trainerId);

    Category category = categoryRepository.findByIdAndCreatedByTrainer_Id(id, trainerId)
            .orElseThrow(() -> {
                log.error("Category with id={} not found for trainerId={}", id, trainerId);
                return new RuntimeException("Category not found");
            });

    List<Exercise> exercisesWithCategory  = exerciseRepository.findByCategory(category);
 
    for (Exercise exercise : exercisesWithCategory ) {
            exercise.setCategory(null); // Remove the category from the exercise
        }
    
    exerciseRepository.saveAll(exercisesWithCategory); // Save the updated exercises
 
    try {
        categoryRepository.delete(category);
        log.info("Category with id={} deleted successfully", id);
        } catch (Exception e) {
        log.error("Error deleting category: {}", e.getMessage());
        throw new RuntimeException("Error deleting category: " + e.getMessage());
        }
    }   

    /**
     * Retrieves all categories associated with a trainer.
     *
     * @param trainerId The UUID of the trainer whose categories are to be retrieved
     * @return List of CategoryResponseDto containing all categories for the trainer
     */

    @Override
    public List<CategoryResponseDto> getAllCategories(UUID trainerId) {
    log.info("Retrieving all exercises for trainerId={}", trainerId);
        if (!userRepository.existsById(trainerId)) {
            log.error("Trainer with id={} not found", trainerId);
            throw new RuntimeException("T   rainer not found");
        }

    List<Category> categories = categoryRepository.findAllByCreatedByTrainer_Id(trainerId);
    return categories.stream()
            .map(CategoryResponseDto::fromEntity)
            .toList();
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param id The UUID of the category to retrieve
     * @param trainerId The UUID of the trainer requesting the category
     * @return CategoryResponseDto containing the requested category's information
     */

    @Override
    public CategoryResponseDto getCategoryById(UUID id, UUID trainerId) {
        log.info("Retrieving category with id={} for trainerId={}", id, trainerId);

        
        Category category = categoryRepository.findByIdAndCreatedByTrainer_Id(id, trainerId)
            .orElseThrow(() -> {
                log.error("Category with id={} not found for trainerId={}", id, trainerId);
                return new RuntimeException("Category not found");
            });

        return CategoryResponseDto.fromEntity(category);
    }

}