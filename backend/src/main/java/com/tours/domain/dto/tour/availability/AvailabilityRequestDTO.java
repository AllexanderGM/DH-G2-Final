package com.tours.domain.dto.tour.availability;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public record AvailabilityRequestDTO(
        @NotNull(message = "La fecha de disponibilidad es obligatoria")
        @Future(message = "La fecha de disponibilidad debe ser en el futuro")
        LocalDateTime availableDate,

        @NotNull(message = "Los cupos disponibles son obligatorios")
        @Min(value = 1, message = "Los cupos disponibles deben ser al menos 1")
        Integer availableSlots,

        @NotNull(message = "La hora de salida es obligatoria")
        LocalDateTime departureTime,

        @NotNull(message = "La hora de regreso es obligatoria")
        LocalDateTime returnTime
) {}