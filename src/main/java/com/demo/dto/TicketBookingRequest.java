package com.demo.dto;

import java.util.List;

public class TicketBookingRequest {
    
	private List<String> passengerNames;
    
    private List<Integer> seatNumbers;
    
    private int busId;
    
    private String journeyDate;
    
	public List<String> getPassengerNames() {
		return passengerNames;
	}

	public void setPassengerNames(List<String> passengerNames) {
		this.passengerNames = passengerNames;
	}

	public List<Integer> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<Integer> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public int getBusId() {
        return busId;
    }

    public void setBusId(int busId) {
        this.busId = busId;
    }

    public String getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(String journeyDate) {
        this.journeyDate = journeyDate;
    }
}

