package com.tours.domain.dto.booking;

import com.tours.infrastructure.entities.booking.Accommodation;
import com.tours.infrastructure.entities.booking.AccommodationBooking;
import com.tours.infrastructure.entities.booking.Booking;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long tourId;
    private Long userId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer adults;
    private Integer children;
    private AccommodationBooking accommodationBooking;
    private Double price;
    private LocalDateTime creationDate;

    public BookingResponseDTO(Booking booking) {
        this.id = booking.getId();
        this.tourId = booking.getTour().getId();
        this.userId = booking.getUser().getId();
        this.startDate = booking.getStartDate();
        this.endDate = booking.getEndDate();
        this.adults = booking.getAdults();
        this.children = booking.getChildren();
        this.price = booking.getPrice();
        this.creationDate = booking.getCreationDate();
        if (booking.getAccommodation() != null) {
            this.accommodationBooking = booking.getAccommodation().getAccommodationBooking();
        }
    }
}