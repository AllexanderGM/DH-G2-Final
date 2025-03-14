package com.tours.domain.services;

import com.tours.domain.dto.booking.ReservationRequestDTO;
import com.tours.domain.dto.booking.ReservationResponseDTO;
import com.tours.exception.NotFoundException;
import com.tours.infrastructure.entities.booking.Availability;
import com.tours.infrastructure.entities.booking.Reservation;
import com.tours.infrastructure.entities.user.User;
import com.tours.infrastructure.repositories.booking.IAvailabilityRepository;
import com.tours.infrastructure.repositories.booking.IReservationRepository;
import com.tours.infrastructure.repositories.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final IReservationRepository reservationRepository;
    private final IAvailabilityRepository availabilityRepository;
    private final IUserRepository userRepository;

    public ReservationResponseDTO createReservation(ReservationRequestDTO reservationDTO) {
        Availability availability = availabilityRepository.findById(reservationDTO.availabilityId())
                .orElseThrow(() -> new NotFoundException("Availability not found with ID: " + reservationDTO.availabilityId()));

        User user = userRepository.findById(reservationDTO.userId())
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + reservationDTO.userId()));

        Reservation reservation = new Reservation();
        reservation.setAvailability(availability);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setQuantity(reservationDTO.quantity());

        Reservation savedReservation = reservationRepository.save(reservation);
        return new ReservationResponseDTO(savedReservation);
    }

    public List<Reservation> findReservationsByAvailability(Long availabilityId) {
        // 1. Validar la existencia de la disponibilidad
        Availability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new NotFoundException("Availability not found with ID: " + availabilityId));

        // 2. Buscar las reservas por disponibilidad
        return reservationRepository.findByAvailability(availability);
    }
}