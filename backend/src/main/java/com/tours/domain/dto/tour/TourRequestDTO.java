package com.tours.domain.dto.tour;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TourRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String name,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
        String description,

        @NotNull(message = "El precio de adulto es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "El precio de adulto debe ser mayor a 0")
        BigDecimal adultPrice,

        @NotNull(message = "El precio de niño es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "El precio de niño debe ser mayor a 0")
        BigDecimal childPrice,

        @NotEmpty(message = "Debe haber al menos una imagen")
        List<@NotBlank(message = "La URL de la imagen no puede estar vacía") String> images,

        @NotNull(message = "El estado es obligatorio")
        Long status,

        @NotNull(message = "La etiqueta es obligatoria")
        Long tag,

        @NotEmpty(message = "Debe haber al menos un include")
        List<@Valid IncludeDTO> includes,

        @NotNull(message = "El destino es obligatorio")
        @Valid DestinationRequestDTO destination,

        Long hotel
) {
}
