package com.trainerlog.dto.category;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
 
@Data
@NoArgsConstructor


public class CategoryRequestDto {

    @NotBlank(message = "Name is required")
    private String name;
    
}
