package com.tours.domain.dto.booking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReservationRequestDTO(
        @NotNull(message = "Id de disponibilidad es requerido")
        Long availabilityId,

        @NotNull(message = "el id del usuario es requerido")
        Long userId,

        @NotNull(message = "la cantidad es requerida")
        @Min(value = 1, message = "la cantidad debe ser mayor a 1")
        Integer quantity
) {
}