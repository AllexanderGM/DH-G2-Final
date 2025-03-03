package com.tours.infrastructure.repositories.tour;

import com.tours.infrastructure.entities.tour.StatusTour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IStatusTourRepository extends JpaRepository<StatusTour, Long> {
}
