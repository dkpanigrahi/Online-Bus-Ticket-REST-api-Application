package com.demo.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.BusResponse;
import com.demo.dto.TicketBookingRequest;
import com.demo.dto.TicketResponse;
import com.demo.dto.UserResponse;
import com.demo.entity.Booking;
import com.demo.entity.Bus;
import com.demo.entity.Driver;
import com.demo.entity.Ticket;
import com.demo.entity.User;
import com.demo.repository.BookingRepository;
import com.demo.repository.BusRepository;
import com.demo.repository.TicketRepository;
import com.demo.service.BookingService;
import com.demo.service.UserService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private BookingService bookingService;

	@Autowired
	private BusRepository busRepository; 
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private TicketRepository ticketRepository;

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
	
	@GetMapping("/seatCount")
    public ResponseEntity<?> getSeatAvailability(
            @RequestParam("busId") Integer busId,
            @RequestParam("date") String dateStr) {
        
        // Create a map to hold error messages
        Map<String, String> errorMap = new HashMap<>();

        // Validate busId
        if (busId == null || busId <= 0) {
            errorMap.put("busId", "Invalid busId provided.");
        } else if (!busRepository.existsById(busId)) {
            errorMap.put("busId", "Bus with the given busId does not exist.");
        }

        // Validate date
        LocalDate date;
        try {
            date = LocalDate.parse(dateStr);
        } catch (DateTimeParseException e) {
            errorMap.put("date", "Invalid date format. Expected format is YYYY-MM-DD.");
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST); // Return if date parsing fails
        }

        // If there are validation errors, return them
        if (!errorMap.isEmpty()) {
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
        }

        // If validation passes, proceed to get seat availability
        Map<Integer, Boolean> seatMap = bookingService.getSeatAvailability(busId, date);
        
        return new ResponseEntity<>(seatMap, HttpStatus.OK);
    }
	
	@GetMapping("/bus/{busId}")
	public ResponseEntity<?> getAllBus(@PathVariable int busId) {
	    Optional<Bus> busOptional = busRepository.findById(busId);
	    
	    if (busOptional.isPresent()) {
	        Bus bus = busOptional.get();
	        
	        BusResponse busResponse = new BusResponse();
	        busResponse.setId(bus.getId());
	        busResponse.setBusNo(bus.getBusNo());
	        busResponse.setStartPlace(bus.getStartPlace());
	        busResponse.setDestination(bus.getDestination());
	        busResponse.setDepartureTime(bus.getDepartureTime());
	        busResponse.setAvailableEveryDay(bus.isAvailableEveryDay());
	        busResponse.setSpecificDays(bus.getSpecificDays());
	        busResponse.setTotalSeats(bus.getTotalSeats());
	        busResponse.setTicketPrice(bus.getTicketPrice());
	        busResponse.setDriverName(bus.getDriver().getName());  
	        busResponse.setConductorName(bus.getConductor().getName()); 

	        return new ResponseEntity<>(busResponse, HttpStatus.OK);
	    }

	    return new ResponseEntity<>("No Bus Available", HttpStatus.NOT_FOUND);
	}
	
	
	
	
	@Transactional
	@PostMapping("/bookTicket")
	public ResponseEntity<?> bookTicket(@RequestBody TicketBookingRequest bookingRequest) {

	    List<String> passengerNames = bookingRequest.getPassengerNames();
	    List<Integer> seatNos = bookingRequest.getSeatNumbers();
	    String date = bookingRequest.getJourneyDate();
	    int busId = bookingRequest.getBusId();

	    Map<String, Object> responseMap = new HashMap<>();
	    
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    LocalDate bookingDate;

	    try {
	        bookingDate = LocalDate.parse(date, formatter);
	    } catch (DateTimeParseException e) {
	        responseMap.put("error", "Invalid Date Format...");
	        return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
	    }

	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String userName = authentication.getName();
	    Optional<User> user = userService.findByEmail(userName);
	    Bus bus = busRepository.findById(busId).orElse(null);

	    if (bus == null) {
	        responseMap.put("error", "Bus Not Found...");
	        return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
	    }

	    // Check if the lists are of the same length
	    if (passengerNames.size() != seatNos.size()) {
	        responseMap.put("error", "Mismatch between passenger names and seat numbers.");
	        return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
	    }

	    // Check if seats are already booked or in process
	    try {
	        synchronized (this) {
	            
	        	List<Integer> bookingIds = new ArrayList<>();
	            
	            for (int i = 0; i < seatNos.size(); i++) {
	                
	            	Integer seatNo = seatNos.get(i);
	                String name = passengerNames.get(i);

	                // Check if the seat is already booked or in process
	                Booking existingBooking = bookingRepository.findBySeatNoAndBookingDate(seatNo, bookingDate);
	                if (existingBooking != null && (existingBooking.isBooked() || existingBooking.isInProcess())) {
	                    responseMap.put("error", "Seat " + seatNo + " is already booked or in process for this date");
	                    return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
	                }

	                // Create a new booking for each seat and assign the passenger name
	                Booking booking = new Booking();
	                booking.setSeatNo(seatNo);
	                booking.setPassengerName(name);  // Assign corresponding passenger name
	                booking.setBookingDate(bookingDate);
	                booking.setInProcess(true);
	                booking.setExpirationTime(LocalDateTime.now().plusMinutes(2));  // temporary lock time
	                booking.setUser(user.get());
	                booking.setBus(bus);

	                Booking savedBooking = bookingRepository.save(booking);
	                bookingIds.add(savedBooking.getId());
	            }

	            responseMap.put("message", "Booking Successful. Proceed To payment..");
	            responseMap.put("bookingIds", bookingIds);  // Return booking IDs
	            return new ResponseEntity<>(responseMap, HttpStatus.CREATED);
	        }
	    } catch (Exception e) {
	        responseMap.put("error", "Failed Booking Ticket: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
	    }
	}
	
	
	@GetMapping("/getTickets")
	public ResponseEntity<?> getAllTickets() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String userName = authentication.getName();
	    Optional<User> user = userService.findByEmail(userName);

	    if (user.isPresent()) {
	        List<Ticket> ticketList = ticketRepository.findByUser(user.get());
	        
	        if (ticketList != null && !ticketList.isEmpty()) {
	            List<TicketResponse> ticketDtos = ticketList.stream()
	                .map(ticket -> new TicketResponse(
	                	ticket.getId(),
	                    ticket.getPassengerName(),
	                    ticket.getSeatNo(),
	                    ticket.getBus().getBusNo(),
	                    ticket.getBus().getDepartureTime(),
	                    ticket.getDate().toString(),
	                    ticket.getTransactionId(),
	                    ticket.getUser().getId()
	                ))
	                .collect(Collectors.toList());

	            return new ResponseEntity<>(ticketDtos, HttpStatus.OK);
	        }
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);   
	    }
	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}






}

