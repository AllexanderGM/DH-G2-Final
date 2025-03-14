package com.tours.application.controllers;

import com.tours.domain.dto.booking.ReservationRequestDTO;
import com.tours.domain.dto.booking.ReservationResponseDTO;
import com.tours.domain.services.ReservationService;
import com.tours.exception.NotFoundException;
import com.tours.infrastructure.entities.booking.Reservation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/availability/{availabilityId}")
    public ResponseEntity<List<Reservation>> getReservationsByAvailability(@PathVariable Long availabilityId) {
        try {
            List<Reservation> reservations = reservationService.findReservationsByAvailability(availabilityId);
            return ResponseEntity.ok(reservations);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}