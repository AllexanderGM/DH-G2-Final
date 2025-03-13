package com.tours.domain.dto.tour.availability;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AvailabilityRequestDTO(
        @NotNull(message = "The date is required")
        @FutureOrPresent(message = "The date must be today or in the future")
        LocalDate availableDate,

        @NotNull(message = "The available slots are required")
        @Min(value = 1, message = "There must be at least one available slot")
        Integer availableSlots,

        @NotNull(message = "The departure time is required")
        LocalDateTime departureTime,

        @NotNull(message = "The return time is required")
        LocalDateTime returnTime
) {
}
