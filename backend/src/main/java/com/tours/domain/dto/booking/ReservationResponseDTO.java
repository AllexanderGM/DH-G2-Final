package com.tours.domain.dto.booking;

import com.tours.infrastructure.entities.booking.Reservation;

import java.time.LocalDateTime;

public record ReservationResponseDTO(
        Long id,
        Long availabilityId,
        Long userId,
        LocalDateTime reservationDate,
        Integer quantity
) {
    public ReservationResponseDTO(Reservation reservation) {
        this(
                reservation.getId(),
                reservation.getAvailability().getId(),
                reservation.getUser().getId(),
                reservation.getReservationDate(),
                reservation.getQuantity()
        );
    }
}