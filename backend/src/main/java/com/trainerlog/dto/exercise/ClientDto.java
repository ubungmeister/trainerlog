package com.trainerlog.dto.exercise;

import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
// DTO for Client information
public class ClientDto {
    private UUID id;
    private String fullName;
    private String email;

    public ClientDto( UUID id, String fullName, String email) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
    }
}
