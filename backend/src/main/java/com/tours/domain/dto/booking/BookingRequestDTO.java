package com.tours.domain.dto.booking;

import com.tours.infrastructure.entities.booking.AccommodationBooking;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequestDTO {
    @NotNull(message = "Id de tour es requerido")
    private Long tourId;
    @NotNull(message = "Fecha de inicio es requerida")
    private LocalDateTime startDate;
    @NotNull(message = "Fecha de fin es requerida")
    private LocalDateTime endDate;
    @NotNull(message = "la cantidad de adultos es requerida")
    @Min(value = 1, message = "la cantidad de adultos debe ser mayor a 1")
    private Integer adults;
    @NotNull(message = "la cantidad de nios es requerida")
    @Min(value = 0, message = "la cantidad de niños debe ser mayor o igual a 0")
    private Integer children;
    //@NotNull(message = "Tipo de alojamiento es requerido")
    private AccommodationBooking accommodationBooking;
    private Long paymentMethodId;
}