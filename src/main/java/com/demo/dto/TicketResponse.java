package com.demo.dto;

public class TicketResponse {
	
	private int id;

	private String passengerName;
	
	private int seatNo;
    
	private String busNo;
    
	private String departureTime;
    
	private String date;
	
	private String transactionId;
	
	private int userId;

	public TicketResponse(int id, String passengerName, int seatNo, String busNo, String departureTime, String date,
			String transactionId, int userId) {
		super();
		this.id = id;
		this.passengerName = passengerName;
		this.seatNo = seatNo;
		this.busNo = busNo;
		this.departureTime = departureTime;
		this.date = date;
		this.transactionId = transactionId;
		this.userId = userId;
	}

	public TicketResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPassengerName() {
		return passengerName;
	}

	public void setPassengerName(String passengerName) {
		this.passengerName = passengerName;
	}

	public int getSeatNo() {
		return seatNo;
	}

	public void setSeatNo(int seatNo) {
		this.seatNo = seatNo;
	}

	public String getBusNo() {
		return busNo;
	}

	public void setBusNo(String busNo) {
		this.busNo = busNo;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
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

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	

	
}
