package com.demo.dto;


import java.util.List;

import com.demo.entity.Bus;

public class SaveTicket {

	private List<String> passengerName;
    
    private List<Integer> seatno;
    
    private List<Integer> bookingids;
    
    private int busId;
    
    private String date;

	private String transactionId;

	public List<String> getPassengerName() {
		return passengerName;
	}

	public void setPassengerName(List<String> passengerName) {
		this.passengerName = passengerName;
	}

	public List<Integer> getSeatno() {
		return seatno;
	}

	public void setSeatno(List<Integer> seatno) {
		this.seatno = seatno;
	}

	public List<Integer> getBookingids() {
		return bookingids;
	}

	public void setBookingids(List<Integer> bookingids) {
		this.bookingids = bookingids;
	}

	public int getBusId() {
		return busId;
	}

	public void setBusId(int busId) {
		this.busId = busId;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
	
	
	
}
