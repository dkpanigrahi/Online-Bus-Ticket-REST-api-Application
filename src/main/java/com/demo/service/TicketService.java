package com.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.Bus;
import com.demo.entity.Ticket;
import com.demo.entity.User;
import com.demo.repository.TicketRepository;

@Service
public class TicketService{

	@Autowired
	private TicketRepository ticketRepository;
	
	
	public Ticket saveTickets(Ticket ticket) {
		
		return ticketRepository.save(ticket);
	}

	
	public List<Ticket> getAllTicket() {
		
		List<Ticket> allTicket = ticketRepository.findAll();
		return allTicket;
	}

	
	public Ticket getTicketById(int id) {
		
		return ticketRepository.findById(id).get();
	}
	

	public List<Ticket> getTicketsByUser(User user) {
		
		return ticketRepository.findByUser(user);
	}

	
	public List<Ticket> getTicketByBus(Bus bus) {
		
		return ticketRepository.findByBus(bus);
	}

	
	public boolean deleteTicket(int id) {
		
		Ticket ticket = ticketRepository.findById(id).get();
		if(ticket != null) {
			ticketRepository.delete(ticket);
			return true;
		}
		return false;
	}

}
