package com.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

	@GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> getUserProfile() {
        return ResponseEntity.ok("User Profile");
    }
}

