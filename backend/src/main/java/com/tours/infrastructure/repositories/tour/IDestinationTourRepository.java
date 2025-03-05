package com.tours.infrastructure.repositories.tour;

import com.tours.infrastructure.entities.tour.DestinationTour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDestinationTourRepository extends JpaRepository<DestinationTour, Long> {
}
