package com.tours.domain.dto.booking;

import com.tours.domain.dto.tour.IncludeDTO;
import com.tours.infrastructure.entities.booking.Booking;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long tourId;
    private String tourName;
    private String tourDescription;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime creationDate;
    private String accommodation;
    private Integer adults;
    private Integer children;
    private Double price;
    private String paymentMethod;
    private List<IncludeDTO> includes;

    public BookingResponseDTO(Booking booking) {
        this.id = booking.getId();
        this.userId = booking.getUser().getId();
        this.tourId = booking.getTour().getId();
        this.tourName = booking.getTour().getName();
        this.tourDescription = booking.getTour().getDescription();
        this.startDate = booking.getStartDate();
        this.endDate = booking.getEndDate();
        this.creationDate = booking.getCreationDate();
        this.adults = booking.getAdults();
        this.children = booking.getChildren();
        this.price = booking.getPrice();
        if(booking.getAccommodation() != null){
            this.accommodation = booking.getAccommodation().getAccommodationBooking().toString();
        }
        if(booking.getPay() != null){
            this.paymentMethod = booking.getPay().getPaymentMethod().getName();
        }
        //Se mapean los includes del tour a una lista de IncludeDTO
        this.includes = booking.getTour().getIncludeTours().stream().map(IncludeDTO::new).collect(Collectors.toList());
    }
}