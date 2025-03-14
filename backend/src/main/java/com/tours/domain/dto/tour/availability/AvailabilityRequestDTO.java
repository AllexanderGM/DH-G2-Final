package com.tours.domain.dto.tour.availability;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequestDTO {
        @NotNull(message = "Available date cannot be null")
        @FutureOrPresent(message = "Available date must be in the present or future")
        private LocalDateTime availableDate;

        @NotNull(message = "Available slots cannot be null")
        @Min(value = 1, message = "Available slots must be at least 1")
        private Integer availableSlots;

        @NotNull(message = "Departure time cannot be null")
        private LocalDateTime departureTime;

        @NotNull(message = "Return time cannot be null")
        private LocalDateTime returnTime;
}
