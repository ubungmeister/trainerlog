    package com.trainerlog.security;

    import java.util.UUID;

import com.trainerlog.model.User;

import lombok.Data;
    import lombok.NoArgsConstructor;
    @Data
    @NoArgsConstructor
    public class CustomUserPrincipal {
        private UUID id;
        private String email;
        private User.Role role;

        public CustomUserPrincipal(UUID id, String email, User.Role role) {
            this.id = id;
            this.email = email;
            this.role = role;
        }
    }