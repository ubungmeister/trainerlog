package com.trainerlog.controller;
import com.trainerlog.dto.category.CategoryRequestDto;
import com.trainerlog.dto.category.CategoryResponseDto;
import com.trainerlog.service.category.CategoryService;
import com.trainerlog.util.SecurityUtil;

import lombok.AllArgsConstructor;

import java.util.Locale.Category;
import java.util.UUID;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@AllArgsConstructor
@RequestMapping("/api/categories")
public class CategotyController {
    
    private final CategoryService categoryService;

    @PostMapping("/create")
    public CategoryResponseDto createCategory(@Valid @RequestBody CategoryRequestDto dto) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return categoryService.createCategory(dto,trainerId);
    }

    @PutMapping("/update/{id}")
    public CategoryResponseDto updateCategory(@PathVariable UUID id, @Valid @RequestBody CategoryRequestDto dto) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return categoryService.updateCategory(id, dto, trainerId);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCategory(@PathVariable UUID id) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        categoryService.deleteCategory(id, trainerId);
    }

    @GetMapping("/all")
    public List<CategoryResponseDto> getAllCategories() {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return categoryService.getAllCategories(trainerId);
    }

    @GetMapping("/{id}")
    public CategoryResponseDto getCategoryById(@PathVariable UUID id) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return categoryService.getCategoryById(id, trainerId);
    }
}