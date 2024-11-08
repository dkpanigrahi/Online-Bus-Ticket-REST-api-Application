package com.demo.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.dto.TransactionDetails;
import com.demo.repository.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

	private static final String KEY = "rzp_test_OtvCYCGxXmuRas";
	
	private static final String KEY_SECRET = "2i733X71YhHOQj9knPvxnA27";
	
	private static final String CURRENCY = "INR";
	
	@Autowired
	private BookingRepository bookingRepository;
	
	
	public TransactionDetails createTransaction(Double amount) {
		
		try {
			JSONObject jsonObject = new JSONObject();
			
			jsonObject.put("amount", (amount*100));
			jsonObject.put("currency", CURRENCY);
			
			RazorpayClient razorpayClient = new RazorpayClient(KEY, KEY_SECRET);
			
			Order order = razorpayClient.orders.create(jsonObject);
			System.out.println("Order Details :"+order);
			
			return prepareTrancation(order);
		
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
		return null;
	}
	
	private TransactionDetails prepareTrancation(Order order) {
		
		String orderId = order.get("id");
		String currency = order.get("currency");
		Integer amount = order.get("amount");
		
		TransactionDetails transactionDetails = new TransactionDetails(orderId,currency,amount);
		
		return transactionDetails;
		
	}
	
}
