package com.demo.controller;

import com.demo.dto.LoginRequest;
import com.demo.dto.RegisterRequest;
import com.demo.entity.User;
import com.demo.security.JwtHelper;
import com.demo.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtHelper jwtHelper;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest registerRequest, BindingResult result) {
        Map<String, String> response = new HashMap<>();
        
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(error -> {
                response.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(response);
        }

        try {
            if (userService.existsByEmail(registerRequest.getEmail())) {
                response.put("error", "Email is already taken");
                return ResponseEntity.badRequest().body(response);
            }           
            if (userService.existsByPhoneNo(registerRequest.getPhoneno())) {
                response.put("error", "Phone number is already taken");
                return ResponseEntity.badRequest().body(response);
            }
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPhoneno(registerRequest.getPhoneno());
            user.setPassword(registerRequest.getPassword());
            user.setRole("ROLE_USER");
            userService.registerUser(user);

            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest) {
        Map<String, String> response = new HashMap<>();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<User> optionalUser = userService.findByEmail(loginRequest.getEmail());
            if (optionalUser.isEmpty()) {
                response.put("error", "Login failed: User not found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            User user = optionalUser.get();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtHelper.generateToken(userDetails, user.getRole());

            response.put("token", "Bearer " + token);
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Login failed: Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
