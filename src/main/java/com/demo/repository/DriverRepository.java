package com.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, Integer> {

	Optional<Driver> findByPhoneNo(String phoneNo);

	Optional<Driver> findById(int driverId);
}
