package com.tours.domain.dto.tour;

import com.tours.infrastructure.entities.tour.StatusTour;

public record StatusDTO(String status) {
    public StatusDTO(StatusTour statusTour) {
        this(statusTour.getStatus().name());
    }
}
