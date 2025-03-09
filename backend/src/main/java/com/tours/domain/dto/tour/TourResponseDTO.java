package com.tours.domain.dto.tour;

import com.tours.infrastructure.entities.tour.Tour;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TourResponseDTO(
        Long id,
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
    private static final Logger logger = LoggerFactory.getLogger(TourResponseDTO.class);
    public TourResponseDTO(Tour tour) {
        this(
                tour.getId(),
                tour.getName(),
                tour.getDescription(),
                tour.getAdultPrice(),
                tour.getChildPrice(),
                tour.getCreationDate(),
                tour.getImages(),
                new StatusDTO(tour.getStatusTour()),
                tour.getTag() != null ? String.valueOf(new TagDTO(tour.getTag()).tag().getDisplayName()) : "Sin etiqueta",
                tour.getIncludeTours() != null ? tour.getIncludeTours().stream().map(IncludeDTO::new).toList() : List.of(),
                new DestinationResponseDTO(tour.getDestinationTour()),
                tour.getHotelTour() != null ? new HotelDTO(tour.getHotelTour()) : null
        );
        if (tour.getHotelTour() == null) {
            logger.warn("El tour '{}' no tiene un hotel asociado", tour.getName());
        }
    }
}
