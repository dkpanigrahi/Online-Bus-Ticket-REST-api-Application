package com.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.demo.entity.Booking;
import com.demo.entity.Bus;
import com.demo.entity.User;
import com.demo.repository.BookingRepository;
import com.demo.repository.BusRepository;

import jakarta.transaction.Transactional;

@Service
public class BookingService {
	
	@Autowired
	private BookingRepository bookingRepository;
	
	
	@Autowired
	private BusRepository busRepository;

	@Transactional
    public void deleteInProcessBookings(User user) {
        bookingRepository.deleteByUserAndInProcess(user, true);
    }
	
	// Run this task every 5 minutes
    @Scheduled(fixedRate = 300000)  // 300,000 milliseconds = 5 minutes
    public void deleteExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        
        // Find all bookings that have expired and are still in process
        List<Booking> expiredBookings = bookingRepository.findByExpirationTimeBeforeAndInProcessTrue(now);

        for (Booking booking : expiredBookings) {
        	// Update the status of the booking instead of deleting it
            booking.setInProcess(false); 
            booking.setBooked(false); 
            booking.setExpirationTime(null);

            bookingRepository.save(booking); // Save the changes
            System.out.println("Updated expired booking: " + booking.getId());
        }
    }

    public Map<Integer, Boolean> getSeatAvailability(Integer busId, LocalDate date) {
    	List<Booking> bookings = bookingRepository.findByBusIdAndBookingDateAndBookedTrue(busId, date);
        
        // Fetch total number of seats for the bus
        Bus bus = busRepository.findById(busId).orElseThrow(() -> new RuntimeException("Bus not found"));
        int totalSeats = bus.getTotalSeats();

        Map<Integer, Boolean> seatMap = new LinkedHashMap<>();
        
        // If there are no bookings, mark all seats as available (false)
        if (bookings.isEmpty()) {
            for (int i = 1; i <= totalSeats; i++) {
                seatMap.put(i, false);  // All seats are available (false)
            }
        } else {
            // Mark all seats as initially available (false)
            for (int i = 1; i <= totalSeats; i++) {
                seatMap.put(i, false);
            }

            // Mark booked seats
            for (Booking booking : bookings) {
                seatMap.put(booking.getSeatNo(), true);  // Mark seat as booked (true)
            }
        }

        return seatMap;
    }

   
    
    
}
