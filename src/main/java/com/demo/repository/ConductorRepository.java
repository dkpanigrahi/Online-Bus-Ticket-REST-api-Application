package com.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.Conductor;
import com.demo.entity.User;

public interface ConductorRepository extends JpaRepository<Conductor, Integer> {

	Optional<Conductor> findById(int conductorId);

	Optional<Conductor> findByPhoneNo(String phoneNo);
	
	

}
