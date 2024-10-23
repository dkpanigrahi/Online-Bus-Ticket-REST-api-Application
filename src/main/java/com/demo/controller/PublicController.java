package com.demo.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.BusResponse;
import com.demo.entity.Bus;
import com.demo.service.BusService;

@RestController
@RequestMapping("/api/public")
public class PublicController {

	@Autowired
	private BusService busService;
	
	
	@GetMapping("/searchBus")
	public ResponseEntity<?> SearchBus(@RequestParam("startPlace") String startPlace,
	                                   @RequestParam("destination") String destination,
	                                   @RequestParam("date") String date) {

	    Map<String, String> response = new HashMap<>();

	    // Validate that date is not empty
	    if (date == null || date.isEmpty()) {
	        response.put("error", "Date is required");
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    try {
	        // Parse the selected date and extract the day of the week
	        LocalDate selectedDate = LocalDate.parse(date);
	        String dayOfWeek = selectedDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

	        // Find buses available every day or on the specific day of the week
	        List<Bus> searchResults = busService.findBusByDate(startPlace, destination, dayOfWeek);
	        
	        if (searchResults != null && !searchResults.isEmpty()) {
		        List<BusResponse> busRespoonse = searchResults.stream().map(bus -> 
		            new BusResponse(
		                bus.getId(),
		                bus.getBusNo(),
		                bus.getStartPlace(),
		                bus.getDestination(),
		                bus.getDepartureTime(),
		                bus.isAvailableEveryDay(),
		                bus.getSpecificDays(),
		                bus.getTotalSeats(),
		                bus.getTicketPrice(),
		                bus.getDriver().getName(),  
		                bus.getConductor().getUser().getName())).collect(Collectors.toList());

		        return new ResponseEntity<>(busRespoonse, HttpStatus.OK);
		    }
		    
		    return new ResponseEntity<>("No Bus Available", HttpStatus.NOT_FOUND);
		    
	    } catch (DateTimeParseException e) {
	        response.put("error", "Invalid date format");
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }
	}

}
