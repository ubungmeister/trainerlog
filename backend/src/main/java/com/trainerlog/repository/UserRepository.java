package com.trainerlog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trainerlog.model.user.User;

import java.util.List;  
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    List<User> findByRole(User.Role role);
    boolean existsByEmail(String email);
}
