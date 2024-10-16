package com.demo.controller;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.DriverRegisterRequest;
import com.demo.dto.UserResponse;
import com.demo.entity.Bus;
import com.demo.entity.Conductor;
import com.demo.entity.Driver;
import com.demo.entity.Ticket;
import com.demo.entity.User;
import com.demo.repository.BusRepository;
import com.demo.repository.ConductorRepository;
import com.demo.repository.DriverRepository;
import com.demo.repository.TicketRepository;
import com.demo.repository.UserRepository;
import com.demo.service.BusService;
import com.demo.service.TicketService;
import com.demo.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private ConductorRepository conductorRepo;
	
	@Autowired
	private DriverRepository driverRepo;
	
	@Autowired
	private BusService busService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private TicketService ticketService;
	
	@Autowired
	private TicketRepository ticketRepository;
	
	@Autowired
    private PasswordEncoder passwordEncoder;

	@GetMapping("/dashboard")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAdminDashboard() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String userName = authentication.getName();
	    Optional<User> user = userService.findByEmail(userName);

	    if (user.isPresent()) {
	        UserResponse userResponseDTO = new UserResponse();
	        userResponseDTO.setName(user.get().getName());
	        userResponseDTO.setEmail(user.get().getEmail());
	        userResponseDTO.setRole(user.get().getRole());
	        userResponseDTO.setPhoneNo(user.get().getPhoneno());

	        return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
	    }
	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	
	@PostMapping("/saveDriver")
	public ResponseEntity<?> createDriver(@Valid @RequestBody DriverRegisterRequest driverRequest, BindingResult result) {
		Map<String, String> errorResponse = new HashMap<>();
		if (result.hasErrors()) {
            result.getFieldErrors().forEach(error -> {
                errorResponse.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errorResponse);
        }


	    // Check if the phone number is already used by another driver
	    Optional<Driver> existingDriver = driverRepo.findByPhoneno(driverRequest.getPhoneno());
	    if (existingDriver.isPresent()) {
	        errorResponse.put("phoneno", "Phone number already exists for another driver");
	        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	    }

	    Driver driver = new Driver();
	    driver.setName(driverRequest.getName());
	    driver.setPhoneno(driverRequest.getPhoneno());
	    driver.setSalary(driverRequest.getSalary());

	    driverRepo.save(driver);

	    return new ResponseEntity<>(HttpStatus.CREATED);
	}


	
	@PostMapping("/saveConductor")
	public ResponseEntity<Driver> createConductor(@RequestBody Conductor conductor)
	{
		try {
		  conductorRepo.save(conductor);
		  return new ResponseEntity<>(HttpStatus.CREATED);
		}catch(Exception e){
		  return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/getDriver")
	public ResponseEntity<?> getAllDriver()
	{
		List<Driver> driverList = driverRepo.findAll();
		if(driverList != null && !driverList.isEmpty()) {
			return new ResponseEntity<>(driverList, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	@GetMapping("/getConductor")
	public ResponseEntity<?> getAllConductor()
	{
		List<Conductor> condList = conductorRepo.findAll();
		if(condList != null && !condList.isEmpty()) {
			return new ResponseEntity<>(condList, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	@PostMapping("/createBus")
	public ResponseEntity<Map<String, String>> createBus(@RequestBody Bus bus, 
	                        @RequestParam String availableDays, 
	                        @RequestParam(required = false) List<String> specificDays) {
		Map<String, String> response = new HashMap<>();
		String departureTimeStr = bus.getDepartureTime();

	    try {
	        // Create a DateTimeFormatter for 12-hour format with AM/PM
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");

	        // Parse the input string into a LocalTime object
	        LocalTime departureTime = LocalTime.parse(departureTimeStr, formatter);
	        
	        // Set the parsed LocalTime into the Bus object
	        bus.setDepartureTime(departureTime);
	        
	        // Set availability based on the selected options
	        if ("Every Day".equals(availableDays)) {
	            bus.setAvailableEveryDay(true);
	            bus.setSpecificDays(null); // Clear specific days if available every day
	        } else {
	            bus.setAvailableEveryDay(false);
	            bus.setSpecificDays(specificDays); // Set specific days
	        }
	        
	        // Save the bus object
	        busService.savebus(bus);
	        
	        response.put("message", "Bus added Successfully");
	        return ResponseEntity.ok(response);
	    } catch (DateTimeParseException e) {
	    	response.put("message", "Invalid Date and Time Format");
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	    	response.put("message", "An Error Occoured while Adding the Bus Please Try Again Later");
	        return ResponseEntity.ok(response);
	    }
	}
	
	
	@GetMapping("/bus")
	public ResponseEntity<?> getAllBus()
	{
		List<Bus> busList = busService.getAllBus();
		if(busList != null && !busList.isEmpty()) {
			return new ResponseEntity<>(busList, HttpStatus.OK);
		}
		return new ResponseEntity<>("No Bus Available",HttpStatus.NOT_FOUND);
		
	}
	
	@GetMapping("/ticket")
	public ResponseEntity<?> getAllTicket()
	{
		List<Ticket> TicketList = ticketRepository.findAll();
		if(TicketList != null && !TicketList.isEmpty()) {
			return new ResponseEntity<>(TicketList, HttpStatus.OK);
		}
		return new ResponseEntity<>("No Ticket Available",HttpStatus.NOT_FOUND);
		
	}
	
	
	
}
