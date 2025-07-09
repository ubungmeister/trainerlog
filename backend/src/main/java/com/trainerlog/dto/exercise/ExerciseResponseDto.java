package com.trainerlog.dto.exercise;


import com.trainerlog.model.Exercise;
import com.trainerlog.model.Category;
import lombok.Data;

@Data
public class ExerciseResponseDto {
    private String id;
    private String name;
    private boolean sharedExercise;
    private boolean activeExercise;
    private String category;
    private String categoryId;


    public ExerciseResponseDto(String id, String name,  boolean sharedExercise, boolean activeExercise, String category, String categoryId) {
        this.id = id;
        this.name = name;
        this.sharedExercise = sharedExercise;
        this.activeExercise = activeExercise;
        this.category = category;
        this.categoryId = categoryId;
     }

    public static ExerciseResponseDto fromEntity(Exercise exercise) {
        Category category = exercise.getCategory();

        return new ExerciseResponseDto(
        exercise.getId().toString(),
        exercise.getName(),
        exercise.isSharedExercise(),
        exercise.isActiveExercise(),
        category != null ? category.getName() : null,
        category != null ? category.getId().toString() : null); 
    }
    
}
