package com.tours.infrastructure.repositories.booking;

import com.tours.infrastructure.entities.booking.Availability;
import com.tours.infrastructure.entities.booking.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByAvailability(Availability availability);
}
