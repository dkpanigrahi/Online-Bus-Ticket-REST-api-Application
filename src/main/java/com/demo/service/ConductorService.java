package com.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.demo.dto.ConductorRegisterRequest;
import com.demo.entity.Conductor;
import com.demo.entity.User;
import com.demo.repository.ConductorRepository;
import com.demo.repository.UserRepository;

@Service
public class ConductorService {

	@Autowired
    private UserRepository userRepository;

    @Autowired
    private ConductorRepository conductorRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Conductor addConductor(ConductorRegisterRequest conductorRequest) {
        // Create User entity with CONDUCTOR role
        User user = new User();
        user.setName(conductorRequest.getName());
        user.setEmail(conductorRequest.getEmail());
        user.setPassword(passwordEncoder.encode(conductorRequest.getPassword()));
        user.setPhoneNo(conductorRequest.getPhoneNo());
        user.setRole("ROLE_CONDUCTOR");

        // Save the user to the database
        User savedUser = userRepository.save(user);

        // Create Conductor entity
        Conductor conductor = new Conductor();
        conductor.setUser(savedUser);
        conductor.setSalary(conductorRequest.getSalary());

        // Save the conductor to the database
        return conductorRepository.save(conductor);
    }

}
