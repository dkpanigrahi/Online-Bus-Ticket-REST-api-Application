package com.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	
	Optional<User> findByEmail(String email);
    
	Optional<User> findByPhoneNo(String phoneno);
	
	long countByRole(String role);
	
	List<User> findByRole(String role);
	
}
