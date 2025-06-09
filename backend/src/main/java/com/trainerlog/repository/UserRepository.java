package com.trainerlog.repository;

import com.trainerlog.model.user.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    List<User> findByRole(User.Role role);

    boolean existsByEmail(String email);

    List<User> findByEmail(String email);

    List<User> findByTrainerId(UUID trainerId);
}   
