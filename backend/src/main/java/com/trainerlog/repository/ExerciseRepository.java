package com.trainerlog.repository;
import com.trainerlog.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.trainerlog.model.Category;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    boolean existsByNameAndCreatedByTrainer_Id(String name, UUID trainerId);
    boolean existsByName(String name);
    boolean existsById(UUID id);
    List<Exercise> findByCreatedByTrainer_Id(UUID trainerId);
    List<Exercise> findByCategory(Category category);
}
