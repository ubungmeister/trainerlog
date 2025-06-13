package com.trainerlog.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.trainerlog.model.User;

import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findByRole(User.Role role);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);

    List<User> findByEmail(String email);

    List<User> findByTrainerId(UUID trainerId);
}   
