package com.tours.domain.dto.tour.availability;

import com.tours.infrastructure.entities.booking.Availability;

import java.time.LocalDateTime;

public record AvailabilityResponseDTO(
        Long id,
        LocalDateTime availableDate, // Cambio aquí
        Integer availableSlots,
        LocalDateTime departureTime,
        LocalDateTime returnTime,
        Long tourId,
        Boolean isReserved // New field
) {
    public AvailabilityResponseDTO(Availability availability, Boolean isReserved) {
        this(
                availability.getId(),
                availability.getAvailableDate(),
                availability.getAvailableSlots(),
                availability.getDepartureTime(),
                availability.getReturnTime(),
                availability.getTour().getId(),
                isReserved
        );
    }
}