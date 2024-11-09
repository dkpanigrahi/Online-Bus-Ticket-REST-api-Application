package com.demo.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.entity.Booking;
import com.demo.entity.User;



public interface BookingRepository extends JpaRepository<Booking,Integer> {

	 Booking findBySeatNoAndBookingDate(int seatNo, LocalDate bookingDate);
	 
	 void deleteByUserAndInProcess(User user, boolean inProcess);
	 
	 // Find bookings that have expired and are still "in process"
	 List<Booking> findByExpirationTimeBeforeAndInProcessTrue(LocalDateTime now);
	 
	 List<Booking> findByUserAndInProcess(User user, boolean inProcess);
	 
	 List<Booking> findByBusIdAndBookingDateAndBookedTrue(int busId, LocalDate bookingDate);

	
	 
	 
}
