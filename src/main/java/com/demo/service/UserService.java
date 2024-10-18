package com.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.demo.entity.User;
import com.demo.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

	public boolean existsByEmail(String email) {
	    return userRepository.findByEmail(email).isPresent();
	}

	public boolean existsByPhoneNo(String phoneno) {
	    return userRepository.findByPhoneNo(phoneno).isPresent();
	}
	
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}
	
	public long countUser(String role) {
		return userRepository.countByRole(role);
	}

}
