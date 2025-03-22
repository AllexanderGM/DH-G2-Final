package com.tours.domain.services;

import com.tours.domain.dto.tour.availability.AvailabilityRequestDTO;
import com.tours.domain.dto.tour.availability.AvailabilityResponseDTO;
import com.tours.exception.BadRequestException;
import com.tours.exception.NotFoundException;
import com.tours.infrastructure.entities.booking.Availability;
import com.tours.infrastructure.entities.booking.Booking;
import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.repositories.booking.IAvailabilityRepository;
import com.tours.infrastructure.repositories.booking.IBookingRepository;
import com.tours.infrastructure.repositories.tour.ITourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final IAvailabilityRepository availabilityRepository;
    private final ITourRepository tourRepository;
    private final IBookingRepository bookingRepository; // Cambiado: Ahora depende de IBookingRepository

    public List<AvailabilityResponseDTO> getAvailabilityByTourId(Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new NotFoundException("No se encontró el tour con ID: " + tourId));

        List<Availability> availabilities = availabilityRepository.findByTour(tour);
        return availabilities.stream()
                .map(availability -> {
                    // Cambiado: Ahora se usa bookingRepository para verificar si hay reservas
                    List<Booking> bookings = bookingRepository.findAll();
                    Boolean isReserved = bookings.stream()
                            .anyMatch(booking -> booking.getTour().equals(tour) &&
                                    booking.getStartDate().isBefore(availability.getAvailableDate().plusDays(1)) &&
                                    booking.getEndDate().isAfter(availability.getAvailableDate()));

                    return new AvailabilityResponseDTO(availability, isReserved);
                })
                .collect(Collectors.toList());
    }

    public AvailabilityResponseDTO addAvailabilityToTour(Long tourId, AvailabilityRequestDTO availabilityDTO) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new NotFoundException("No se encontró el tour con ID: " + tourId));

        // Validar que la fecha sea en el futuro
        if (availabilityDTO.availableDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("La fecha de disponibilidad debe ser en el futuro");
        }

        // Validar que la hora de regreso sea posterior a la hora de salida
        if (availabilityDTO.returnTime().isBefore(availabilityDTO.departureTime()) || availabilityDTO.returnTime().equals(availabilityDTO.departureTime())) {
            throw new BadRequestException("La hora de regreso debe ser posterior a la hora de salida");
        }

        // Validar que los cupos sean positivos
        if (availabilityDTO.availableSlots() <= 0) {
            throw new BadRequestException("Los cupos disponibles deben ser mayores a cero");
        }

        // Validar que no haya superposición con otras disponibilidades
        List<Availability> existingAvailabilities = availabilityRepository.findByTour(tour);
        for (Availability existingAvailability : existingAvailabilities) {
            if (isOverlapping(availabilityDTO, existingAvailability)) {
                throw new BadRequestException("La disponibilidad se superpone con otra ya existente");
            }
        }

        Availability availability = new Availability();
        availability.setAvailableDate(availabilityDTO.availableDate());
        availability.setAvailableSlots(availabilityDTO.availableSlots());
        availability.setDepartureTime(availabilityDTO.departureTime());
        availability.setReturnTime(availabilityDTO.returnTime());
        availability.setTour(tour);

        Availability savedAvailability = availabilityRepository.save(availability);
        return new AvailabilityResponseDTO(savedAvailability, false);
    }

    public List<AvailabilityResponseDTO> findAvailabilitiesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            throw new BadRequestException("La fecha de inicio y la fecha de fin son obligatorias");
        }
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("La fecha de inicio debe ser anterior a la fecha de fin");
        }
        List<Availability> availabilities = availabilityRepository.findByDateRange(startDate, endDate);
        return availabilities.stream()
                .map(availability -> {
                    // Cambiado: Ahora se usa bookingRepository para verificar si hay reservas
                    List<Booking> bookings = bookingRepository.findAll();
                    Boolean isReserved = bookings.stream()
                            .anyMatch(booking -> booking.getTour().equals(availability.getTour()) &&
                                    booking.getStartDate().isBefore(availability.getAvailableDate().plusDays(1)) &&
                                    booking.getEndDate().isAfter(availability.getAvailableDate()));

                    return new AvailabilityResponseDTO(availability, isReserved);
                })
                .collect(Collectors.toList());
    }

    private boolean isOverlapping(AvailabilityRequestDTO newAvailability, Availability existingAvailability) {
        LocalDateTime newStart = newAvailability.availableDate().withHour(newAvailability.departureTime().getHour()).withMinute(newAvailability.departureTime().getMinute());
        LocalDateTime newEnd = newAvailability.availableDate().withHour(newAvailability.returnTime().getHour()).withMinute(newAvailability.returnTime().getMinute());
        LocalDateTime existingStart = existingAvailability.getAvailableDate().withHour(existingAvailability.getDepartureTime().getHour()).withMinute(existingAvailability.getDepartureTime().getMinute());
        LocalDateTime existingEnd = existingAvailability.getAvailableDate().withHour(existingAvailability.getReturnTime().getHour()).withMinute(existingAvailability.getReturnTime().getMinute());

        return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    }
}