package com.tours.infrastructure.repositories.booking;

import com.tours.infrastructure.entities.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTourId(Long tourId);
}
