package com.tours.infrastructure.repositories.location;

import com.tours.infrastructure.entities.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ILocationRepository extends JpaRepository<Location, Long> {
}
