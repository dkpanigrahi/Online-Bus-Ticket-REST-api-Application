package com.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.demo.dto.BookingStatusRequest;
import com.demo.dto.SaveTicket;
import com.demo.dto.TransactionDetails;
import com.demo.dto.UserResponse;
import com.demo.entity.Ticket;
import com.demo.entity.User;
import com.demo.service.PaymentService;
import com.demo.service.UserService;

@RestController
@RequestMapping("/user/payment")
public class PaymentController {
	
	@Autowired
	private PaymentService paymentService;
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/checkStatus")
    public ResponseEntity<Boolean> checkBookingStatus(@RequestBody BookingStatusRequest request) {
        
        List<Integer> bookingIds = request.getBookingIds();

        boolean status = paymentService.checkBookingStatus(bookingIds);
        return ResponseEntity.ok(status);
    }

	@GetMapping("/createTransaction/{amount}")
	public TransactionDetails createTransaction(@PathVariable Double amount) {
		
		return paymentService.createTransaction(amount);
		
	}
	

	@PostMapping("/saveTicket")
	public ResponseEntity<?> saveTicket(@RequestBody SaveTicket ticketData){

	        try {
	           
	        	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    	    String userName = authentication.getName();
	    	    Optional<User> user = userService.findByEmail(userName);
	    	    
	    	    if (user.isPresent()) {
	    	    	 Map<String, String> response = new HashMap<>();
	    	    	 
	    	    	 List<Ticket> savedTicket = paymentService.saveTicket(ticketData, user.get());
	    	    	 
	    	    	 response.put("message", "Ticket Booked or Saved Successfully...");
	    	         return new ResponseEntity<>(response, HttpStatus.OK);
	    	    }
	    	    return new ResponseEntity<>("User Not Found...",HttpStatus.NOT_FOUND);
	       	           

	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving ticket: " + e.getMessage());
	        }
	 }

}
