package com.demo.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.naming.TransactionRef;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.dto.SaveTicket;
import com.demo.dto.TransactionDetails;
import com.demo.entity.Booking;
import com.demo.entity.Bus;
import com.demo.entity.Ticket;
import com.demo.entity.User;
import com.demo.repository.BookingRepository;
import com.demo.repository.BusRepository;
import com.demo.repository.TicketRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

	private static final String KEY = "rzp_test_OtvCYCGxXmuRas";
	
	private static final String KEY_SECRET = "2i733X71YhHOQj9knPvxnA27";
	
	private static final String CURRENCY = "INR";
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private TicketRepository ticketRepository;
	
	@Autowired
	private BusRepository busRepository;
	
	
	
	
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
		
		TransactionDetails transactionDetails = new TransactionDetails(orderId,currency,amount,this.KEY);
		
		return transactionDetails;
		
	}

	
	public List<Ticket> saveTicket(SaveTicket ticketData, User user) {

	    String date = ticketData.getDate();
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    LocalDate journeyDate = LocalDate.parse(date, formatter);

	    Optional<Bus> bus = busRepository.findById(ticketData.getBusId());
	    if (!bus.isPresent()) {
	        throw new RuntimeException("Bus not found.");
	    }


	    List<Ticket> tickets = new ArrayList<>();
	    
	    // Loop through each passenger, seat number, and booking ID
	    for (int i = 0; i < ticketData.getPassengerName().size(); i++) {
	        String passengerName = ticketData.getPassengerName().get(i);
	        Integer seatNo = ticketData.getSeatno().get(i);
	        Integer bookingId = ticketData.getBookingids().get(i);
	        String transactionId = ticketData.getTransactionId();

	        // Retrieve the booking using the booking ID
	        Booking booking = bookingRepository.findById(bookingId)
	            .orElseThrow(() -> new RuntimeException("Booking not found for ID: " + bookingId));

	        // Ensure that the booking matches the user, seat, and date
	        if (!booking.getUser().equals(user) || !booking.getSeatNo().equals(seatNo) || !booking.getBookingDate().equals(journeyDate)) {
	            throw new RuntimeException("Booking details mismatch for booking ID: " + bookingId);
	        }

	        // Mark booking as permanently booked and associate with the transaction
	        booking.setBooked(true);
	        booking.setInProcess(false);
	        booking.setExpirationTime(null);
	  
	        bookingRepository.save(booking);

	        // Create a new Ticket for the passenger
	        Ticket ticket = new Ticket();
	        ticket.setPassengerName(passengerName);
	        ticket.setDate(journeyDate);
	        ticket.setBus(bus.get());
	        ticket.setUser(user);
	        ticket.setSeatNo(seatNo);
	        ticket.setTransactionId(transactionId);

	        // Save the ticket and add it to the list
	        tickets.add(ticketRepository.save(ticket));
	    }

	    return tickets;  // Return the list of saved tickets
	}

	public boolean checkBookingStatus(List<Integer> bookingIds) {
		
		List<Booking> bookings = bookingRepository.findAllById(bookingIds);
		      for (Booking booking : bookings) {
		          if (!booking.isInProcess()) {
		              return false;  
		           }
		      }
		      return true;  
		 }

	
}
