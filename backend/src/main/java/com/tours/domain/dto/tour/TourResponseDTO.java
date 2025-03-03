package com.tours.domain.dto.tour;

import com.tours.infrastructure.entities.tour.Tour;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TourResponseDTO(
        String name,
        String description,
        BigDecimal adultPrice,
        BigDecimal childPrice,
        LocalDate creationDate,
        List<String> images,
        StatusDTO status,
        String tag,
        List<IncludeDTO> includes,
        DestinationResponseDTO destination,
        HotelDTO hotel
) {
    public TourResponseDTO(Tour tour) {
        this(
                tour.getName(),
                tour.getDescription(),
                tour.getAdultPrice(),
                tour.getChildPrice(),
                tour.getCreationDate(),
                tour.getImages(),
                new StatusDTO(tour.getStatusTour()),
                String.valueOf(new TagDTO(tour.getTag())),
                tour.getIncludeTours().stream().map(IncludeDTO::new).toList(),
                new DestinationResponseDTO(tour.getDestinationTour()),
                new HotelDTO(tour.getHotelTour())
        );
    }
}
