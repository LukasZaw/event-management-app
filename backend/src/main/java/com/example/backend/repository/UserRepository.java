package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByName(String name);

    boolean existsByEmail(String email);

    java.util.List<User> findByRole(User.Role role);
}
