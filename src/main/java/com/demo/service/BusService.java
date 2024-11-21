package com.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.Bus;
import com.demo.repository.BusRepository;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    public void saveBus(Bus bus) {
		busRepository.save(bus);		
	}
   
    public Bus getBusById(int busId) {
        return busRepository.findById(busId).orElse(null);
    }

    // Find buses by start and destination places
    public List<Bus> findBus(String startPlace, String destination) {
        return busRepository.findByStartPlaceAndDestination(startPlace, destination);
    }

   
    public Bus updateBus(Bus bus) {
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    // Find buses by date and day of the week
    public List<Bus> findBusByDate(String startPlace, String destination, String dayOfWeek) {
        return busRepository.findBusByDate(startPlace, destination, dayOfWeek);
    }

    public boolean isDriverAssignedToAnotherBus(int driverId) {
        return busRepository.existsByDriverId(driverId);
    }

    public boolean isConductorAssignedToAnotherBus(int conductorId) {
       
        return busRepository.existsByConductorId(conductorId);
    }
    
    public long countBus() {
    	return busRepository.count();
    }
    
    public List<String> getAllBusNumbers() {
        return busRepository.findAll().stream()
                .map(Bus::getBusNo) 
                .toList();
    }

	
}
