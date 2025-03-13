package com.tours.infrastructure.repositories.booking;

import com.tours.infrastructure.entities.booking.Availability;
import com.tours.infrastructure.entities.tour.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByTour(Tour tour);
}