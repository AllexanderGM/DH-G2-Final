package com.tours.domain.dto.tour.filter;

import com.tours.infrastructure.entities.tour.TagTour;
import com.tours.infrastructure.entities.tour.Tour;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TourFilterDTO {
    private String query;      // Texto de búsqueda (ej: "Cusco")
    private List<TagTour> tags;  // Categoría del tour (ej: "Aventura")

    public TourFilterDTO(Tour tour) {
        this.tags = tour.getTags();
    }
}