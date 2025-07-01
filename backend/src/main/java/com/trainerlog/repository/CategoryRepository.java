package com.trainerlog.repository;
import com.trainerlog.model.Category;

import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    boolean existsByNameAndCreatedByTrainer_Id(String name, UUID trainerId);
    List<Category> findAllByCreatedByTrainer_Id(UUID trainerId);
    Optional<Category> findByIdAndCreatedByTrainer_Id(UUID id, UUID trainerId);

}