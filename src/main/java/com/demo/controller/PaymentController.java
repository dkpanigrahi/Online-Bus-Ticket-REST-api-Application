package com.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.TransactionDetails;
import com.demo.service.PaymentService;

@RestController
@RequestMapping("/api/user/payment")
public class PaymentController {
	
	@Autowired
	private PaymentService paymentService;

	@GetMapping("/createTransaction/{amount}")
	public TransactionDetails createTransaction(@PathVariable Double amount) {
		
		return paymentService.createTransaction(amount);
		
	}
}
