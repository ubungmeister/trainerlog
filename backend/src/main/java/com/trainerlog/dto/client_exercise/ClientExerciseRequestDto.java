package com.trainerlog.dto.client_exercise;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import com.trainerlog.validation.ValidationGroups;
@Data
@NoArgsConstructor
public class ClientExerciseRequestDto {
   
    @NotNull
    private UUID clientId;

    @NotNull(groups = {ValidationGroups.Update.class }, message = "status is required")
    private boolean activeClientExercise;

    //for cases when Trainer choose exercise from existing list
    private UUID exerciseId;

    //for cases when Trainer add exercise to client directly 
    private String name; 

}
