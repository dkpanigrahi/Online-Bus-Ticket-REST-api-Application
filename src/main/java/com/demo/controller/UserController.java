package com.demo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.UserResponse;
import com.demo.entity.User;
import com.demo.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
	private UserService userService;

	@GetMapping("/profile")
	public ResponseEntity<?> getAdminDashboard() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String userName = authentication.getName();
	    Optional<User> user = userService.findByEmail(userName);

	    if (user.isPresent()) {
	        UserResponse userResponseDTO = new UserResponse();
	        userResponseDTO.setName(user.get().getName());
	        userResponseDTO.setEmail(user.get().getEmail());
	        userResponseDTO.setRole(user.get().getRole());
	        userResponseDTO.setPhoneNo(user.get().getPhoneNo());

	        return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
	    }
	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}

