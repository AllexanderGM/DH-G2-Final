package com.tours.infrastructure.repositories.tour;

import com.tours.infrastructure.entities.tour.DestinationTour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IDestinationRepository extends JpaRepository<DestinationTour, Long> {
    Optional<DestinationTour> findByCity(String city);
}
