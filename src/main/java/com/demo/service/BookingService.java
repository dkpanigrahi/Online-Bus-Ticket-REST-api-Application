package com.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.demo.entity.Booking;
import com.demo.entity.User;
import com.demo.repository.BookingRepository;

import jakarta.transaction.Transactional;

@Service
public class BookingService {
	
	@Autowired
	private BookingRepository bookingRepository;

	@Transactional
    public void deleteInProcessBookings(User user) {
        bookingRepository.deleteByUserAndInProcess(user, true);
    }
	
	// Run this task every 5 minutes (or choose your own schedule)
    @Scheduled(fixedRate = 100000)  // 300,000 milliseconds = 5 minutes
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
}
