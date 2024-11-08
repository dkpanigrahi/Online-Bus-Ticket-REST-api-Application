package com.demo.config;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import com.demo.entity.User;
import com.demo.repository.ConductorRepository;
import com.demo.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByEmail(username);

        User user = optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // Get authorities (e.g., ROLE_CONDUCTOR) based on whether the user is a conductor or not
        String role = user.getRole();

        // Return UserDetails object with appropriate role
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(role)
                .build();
    }
}