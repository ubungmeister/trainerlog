package com.trainerlog.service.category;
import java.util.UUID;
import com.trainerlog.dto.category.CategoryRequestDto;
import com.trainerlog.dto.category.CategoryResponseDto;
import java.util.List;
public interface CategoryService {
    CategoryResponseDto createCategory(CategoryRequestDto dto, UUID trainerId);
    CategoryResponseDto updateCategory(UUID id, CategoryRequestDto dto, UUID trainerId);
    void deleteCategory(UUID id, UUID trainerId);
    List<CategoryResponseDto> getAllCategories(UUID trainerId);
    CategoryResponseDto getCategoryById(UUID id, UUID trainerId);
} 