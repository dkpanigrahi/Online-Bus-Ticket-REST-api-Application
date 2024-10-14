package com.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.Bus;
import com.demo.repository.BusRepository;

import jakarta.transaction.Transactional;

@Service
public class BusService {

	@Autowired
	private BusRepository busRepository;
	
	
	public Bus savebus(Bus bus) {
		
		return busRepository.save(bus);
	}

	
    public Bus getBusById(int busId) {
        return busRepository.findById(busId).orElse(null);
    }

	
	public List<Bus> findBus(String startp, String destp) {
		List<Bus> buslist = busRepository.findByStartPlaceAndDestination(startp, destp);
		return buslist;
	}


	public Bus updatebus(Bus bus) {
		
		return busRepository.save(bus);
	}

	
    @Transactional
    public void deleteBusById(int id) {
        busRepository.deleteById(id);
    }

	
	public List<Bus> getAllBus() {
		
		List<Bus> buslist = busRepository.findAll();
		return buslist;
	}

	public List<Bus> findBusByDate(String startPlace, String destination, String dayOfWeek) {
		
		return busRepository.findBusByDate(startPlace, destination, dayOfWeek);		
	}


}
