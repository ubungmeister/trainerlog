package com.trainerlog.dto.category;
import lombok.Data;
import com.trainerlog.model.Category;

@Data
public class CategoryResponseDto {

    private String id;
    private String name;


    public CategoryResponseDto(String id, String name) {
        this.id = id;
        this.name = name;
        
    }

    public static CategoryResponseDto fromEntity(Category category) {
        return new CategoryResponseDto(category.getId().toString(), category.getName());
    }
    
}
