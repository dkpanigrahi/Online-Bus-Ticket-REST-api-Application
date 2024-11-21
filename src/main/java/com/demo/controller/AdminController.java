package com.demo.controller;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

import com.demo.dto.BusDto;
import com.demo.dto.BusResponse;
import com.demo.dto.ConductorRegisterRequest;
import com.demo.dto.ConductorResponse;
import com.demo.dto.DriverRegisterRequest;
import com.demo.dto.RegisterRequest;
import com.demo.dto.TicketResponse;
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

	
	@PostMapping("/saveDriver")
	public ResponseEntity<?> createDriver(@Valid @RequestBody DriverRegisterRequest driverRequest, BindingResult result) {
		Map<String, String> response = new HashMap<>();
		if (result.hasErrors()) {
            result.getFieldErrors().forEach(error -> {
                response.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(response);
        }
		try {
			// Check if the phone number is already used by another driver
		    Optional<Driver> existingDriver = driverRepo.findByPhoneNo(driverRequest.getPhoneNo());
		    if (existingDriver.isPresent()) {
		        response.put("phoneNo", "Phone number already exists for another driver");
		        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
		    }

		    Driver driver = new Driver();
		    driver.setName(driverRequest.getName());
		    driver.setPhoneNo(driverRequest.getPhoneNo());
		    driver.setSalary(driverRequest.getSalary());

		    driverRepo.save(driver);
		    response.put("message", "Driver Added Successfully");
		    return new ResponseEntity<>(response,HttpStatus.CREATED);

		} catch (Exception e) {
			response.put("error", "failed Add Driver: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}

	}


	
	@PostMapping("/saveConductor")
	public ResponseEntity<Map<String, String>> createConductor(
	    @Valid @RequestBody ConductorRegisterRequest conductorRequest, BindingResult result) {
		
	    Map<String, String> response = new HashMap<>();

	    if (result.hasErrors()) {
	        result.getFieldErrors().forEach(error -> {
	            response.put(error.getField(), error.getDefaultMessage());
	        });
	        return ResponseEntity.badRequest().body(response);
	    }

	    try {
	    
	    	Optional<Conductor> existingConductor = conductorRepo.findByPhoneNo(conductorRequest.getPhoneNo());
		    if (existingConductor.isPresent()) {
		        response.put("phoneNo", "Phone number already exists for another Conductor");
		        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
		    }
	        
	        Conductor conductor = new Conductor();
		    conductor.setName(conductorRequest.getName());
		    conductor.setPhoneNo(conductorRequest.getPhoneNo());
		    conductor.setSalary(conductorRequest.getSalary());

	        conductorRepo.save(conductor);

	        response.put("message", "Conductor registered successfully");
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        response.put("error", "Registration failed: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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
		if (condList != null && !condList.isEmpty()) { 
	        return new ResponseEntity<>(condList, HttpStatus.OK);
	    }
	    
	    return new ResponseEntity<>("No Conductor Available", HttpStatus.NOT_FOUND);
		
	}
	
	
	@PostMapping("/createBus")
	public ResponseEntity<Map<String, String>> createBus(@Valid @RequestBody BusDto busDto, BindingResult result) {
	    
	    Map<String, String> response = new HashMap<>();
	    
	    if (result.hasErrors()) {
	        result.getFieldErrors().forEach(error -> {
	            response.put(error.getField(), error.getDefaultMessage());
	        });
	        return ResponseEntity.badRequest().body(response);
	    }
	    
	    try {
	        Optional<Driver> driver = driverRepo.findById(busDto.getDriverId());
	        if (driver.isEmpty()) {
	            response.put("Error", "Driver Not Present in DataBase");
	            return ResponseEntity.badRequest().body(response);
	        }
	        
	        Optional<Conductor> conductor = conductorRepo.findById(busDto.getConductorId());
	        if (conductor.isEmpty()) {
	            response.put("Error", "Conductor Not Present in DataBase");
	            return ResponseEntity.badRequest().body(response);
	        }
	        
	     	if (busService.isDriverAssignedToAnotherBus(busDto.getDriverId())) {
	            response.put("driverId", "Driver is already assigned to another bus");
	            return ResponseEntity.badRequest().body(response);
	        }
	        
	        if (busService.isConductorAssignedToAnotherBus(busDto.getConductorId())) {
	            response.put("conductorId", "Conductor is already assigned to another bus");
	            return ResponseEntity.badRequest().body(response);
	        }
	   
			/*
			 * DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a"); // or
			 * "HH:mm" for 24-hour format LocalTime departureTime =
			 * LocalTime.parse(busDto.getDepartureTime(), formatter);
			 */	        
	        // Create a new Bus object
	        Bus bus = new Bus();
	        bus.setBusNo(busDto.getBusNo());
	        bus.setStartPlace(busDto.getStartPlace());
	        bus.setDestination(busDto.getDestination());
	        bus.setCoach(busDto.getCoach());
	        bus.setDepartureTime(busDto.getDepartureTime());	        
	        bus.setTotalSeats(busDto.getTotalSeats());
	        bus.setTicketPrice(busDto.getTicketPrice());
	        bus.setDriver(driver.get());
	        bus.setConductor(conductor.get());
	        
	        // Set availability and specific days based on the request
	        bus.setAvailableEveryDay(busDto.isAvailableEveryDay());
	        if (busDto.isAvailableEveryDay()) {
	            bus.setSpecificDays(null);
	        } else {
	            bus.setSpecificDays(busDto.getSpecificDays());
	        }
	        
	        busService.saveBus(bus);
	        
	        response.put("message", "Bus added successfully");
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        response.put("error", "An error occurred while adding the bus. Please try again later.");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }
	}

	
	
	@GetMapping("/bus")
	public ResponseEntity<?> getAllBus() {
	    List<Bus> busList = busService.getAllBuses();
	    
	    if (busList != null && !busList.isEmpty()) {
	        List<BusResponse> busRespoonse = busList.stream().map(bus -> 
	            new BusResponse(
	                bus.getId(),
	                bus.getBusNo(),
	                bus.getCoach(),
	                bus.getStartPlace(),
	                bus.getDestination(),
	                bus.getDepartureTime(),
	                bus.isAvailableEveryDay(),
	                bus.getSpecificDays(),
	                bus.getTotalSeats(),
	                bus.getTicketPrice(),
	                bus.getDriver().getName(),  
	                bus.getConductor().getName())).collect(Collectors.toList());

	        return new ResponseEntity<>(busRespoonse, HttpStatus.OK);
	    }
	    
	    return new ResponseEntity<>("No Bus Available", HttpStatus.NOT_FOUND);
	}
	
	@GetMapping("/busNumber")
	public ResponseEntity<?> getAllBusNumber() {
	     List<String> busNoList = busService.getAllBusNumbers();
	     
	     if(busNoList != null && !busNoList.isEmpty()) {	     
	    	 return new ResponseEntity<>(busNoList,HttpStatus.OK);
	    }	    
	    return new ResponseEntity<>("No Bus Number Available", HttpStatus.NOT_FOUND);
	}
	

	
	@GetMapping("/ticket")
	public ResponseEntity<?> getAllTicket()
	{
		List<Ticket> TicketList = ticketRepository.findAll();
		if(TicketList != null && !TicketList.isEmpty()) {
			List<TicketResponse> ticketResponse = TicketList.stream().map(ticket -> new TicketResponse(
					ticket.getId(),
                    ticket.getPassengerName(),
                    ticket.getSeatNo(),
                    ticket.getBus().getBusNo(),
                    ticket.getBus().getDepartureTime(),
                    ticket.getDate().toString(),
                    ticket.getTransactionId(),
                    ticket.getUser().getId()
                    )).toList();
			return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
		}
		return new ResponseEntity<>("No Ticket Available",HttpStatus.NOT_FOUND);
		
	}
	
	
	@GetMapping("/getUsers")
	public ResponseEntity<?> getAllUser()
	{
		String Role = "ROLE_USER";
		List<User> userList = userService.getAllUserByRole(Role);
		if(userList != null && !userList.isEmpty()) {
			return new ResponseEntity<>(userList, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	
	@GetMapping("/busCount")
	public ResponseEntity<?> getBusCount()
	{
		long c = busService.countBus();
		return new ResponseEntity<>(c,HttpStatus.OK);		
	}
	
	@GetMapping("/driverCount")
	public ResponseEntity<?> getDriverCount()
	{
		long c = driverRepo.count();
		return new ResponseEntity<>(c,HttpStatus.OK);		
	}
	
	@GetMapping("/conductorCount")
	public ResponseEntity<?> getConductorCount()
	{
		
		long c = conductorRepo.count();
		return new ResponseEntity<>(c,HttpStatus.OK);		
	}
	
	@GetMapping("/userCount")
	public ResponseEntity<?> getUserCount()
	{
		String role = "ROLE_USER";
		long c = userService.countUser(role);
		return new ResponseEntity<>(c,HttpStatus.OK);		
	}
	
	
}
