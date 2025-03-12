package com.tours.application.controllers;


import com.tours.domain.dto.tour.availability.AvailabilityRequestDTO;
import com.tours.domain.dto.tour.availability.AvailabilityResponseDTO;
import com.tours.domain.services.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<AvailabilityResponseDTO>> getAvailabilityByTourId(@PathVariable Long tourId) {
        List<AvailabilityResponseDTO> availabilities = availabilityService.getAvailabilityByTourId(tourId);
        return ResponseEntity.ok(availabilities);
    }

    @PostMapping("/tour/{tourId}")
    public ResponseEntity<AvailabilityResponseDTO> addAvailabilityToTour(
            @PathVariable Long tourId,
            @Valid @RequestBody AvailabilityRequestDTO availabilityDTO) {
        AvailabilityResponseDTO savedAvailability = availabilityService.addAvailabilityToTour(tourId, availabilityDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAvailability);
    }
}