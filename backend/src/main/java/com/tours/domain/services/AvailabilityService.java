package com.tours.domain.services;

import com.tours.domain.dto.tour.availability.AvailabilityRequestDTO;
import com.tours.domain.dto.tour.availability.AvailabilityResponseDTO;
import com.tours.exception.NotFoundException;
import com.tours.infrastructure.entities.booking.Availability;
import com.tours.infrastructure.entities.booking.Reservation;
import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.repositories.booking.IAvailabilityRepository;
import com.tours.infrastructure.repositories.booking.IReservationRepository;
import com.tours.infrastructure.repositories.tour.ITourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final IAvailabilityRepository availabilityRepository;
    private final ITourRepository tourRepository;
    private final IReservationRepository reservationRepository;

    public List<AvailabilityResponseDTO> getAvailabilityByTourId(Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new NotFoundException("Tour not found with ID: " + tourId));

        List<Availability> availabilities = availabilityRepository.findByTour(tour);
        return availabilities.stream()
                .map(availability -> {
                    List<Reservation> reservations = reservationRepository.findByAvailability(availability);
                    Boolean isReserved = !reservations.isEmpty();
                    return new AvailabilityResponseDTO(availability, isReserved);
                })
                .collect(Collectors.toList());
    }

    public AvailabilityResponseDTO addAvailabilityToTour(Long tourId, AvailabilityRequestDTO availabilityDTO) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new NotFoundException("Tour not found with ID: " + tourId));

        Availability availability = new Availability();
        availability.setAvailableDate(availabilityDTO.availableDate());
        availability.setAvailableSlots(availabilityDTO.availableSlots());
        availability.setDepartureTime(availabilityDTO.departureTime());
        availability.setReturnTime(availabilityDTO.returnTime());
        availability.setTour(tour);

        Availability savedAvailability = availabilityRepository.save(availability);
        return new AvailabilityResponseDTO(savedAvailability, false);
    }
}