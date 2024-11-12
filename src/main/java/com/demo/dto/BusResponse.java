package com.demo.dto;

import java.util.List;

public class BusResponse {
    
	private int id;
    
	private String busNo;
    
	private String coach;
    
	private String startPlace;
    
	private String destination;
    
	private String departureTime;
    
	private boolean availableEveryDay;
    
	private List<String> specificDays;
    
	private int totalSeats;
    
	private double ticketPrice;
    
	private String driverName;
    
	private String conductorName;

	public BusResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public BusResponse(int id, String busNo, String coach, String startPlace, String destination, String departureTime,
			boolean availableEveryDay, List<String> specificDays, int totalSeats, double ticketPrice, String driverName,
			String conductorName) {
		super();
		this.id = id;
		this.busNo = busNo;
		this.coach = coach;
		this.startPlace = startPlace;
		this.destination = destination;
		this.departureTime = departureTime;
		this.availableEveryDay = availableEveryDay;
		this.specificDays = specificDays;
		this.totalSeats = totalSeats;
		this.ticketPrice = ticketPrice;
		this.driverName = driverName;
		this.conductorName = conductorName;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getBusNo() {
		return busNo;
	}

	public void setBusNo(String busNo) {
		this.busNo = busNo;
	}

	public String getCoach() {
		return coach;
	}

	public void setCoach(String coach) {
		this.coach = coach;
	}

	public String getStartPlace() {
		return startPlace;
	}

	public void setStartPlace(String startPlace) {
		this.startPlace = startPlace;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}

	public boolean isAvailableEveryDay() {
		return availableEveryDay;
	}

	public void setAvailableEveryDay(boolean availableEveryDay) {
		this.availableEveryDay = availableEveryDay;
	}

	public List<String> getSpecificDays() {
		return specificDays;
	}

	public void setSpecificDays(List<String> specificDays) {
		this.specificDays = specificDays;
	}

	public int getTotalSeats() {
		return totalSeats;
	}

	public void setTotalSeats(int totalSeats) {
		this.totalSeats = totalSeats;
	}

	public double getTicketPrice() {
		return ticketPrice;
	}

	public void setTicketPrice(double ticketPrice) {
		this.ticketPrice = ticketPrice;
	}

	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}

	public String getConductorName() {
		return conductorName;
	}

	public void setConductorName(String conductorName) {
		this.conductorName = conductorName;
	}

    
    
}

