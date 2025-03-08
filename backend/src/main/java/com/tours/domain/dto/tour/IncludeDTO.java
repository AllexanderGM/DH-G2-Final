package com.tours.domain.dto.tour;

import com.tours.infrastructure.entities.tour.IncludeTours;

public record IncludeDTO(
        String type,
        String icon,
        String details,
        String description
) {
    public IncludeDTO(IncludeTours includeTours) {
        this(includeTours.getType(), includeTours.getIcon(), includeTours.getDetails(), includeTours.getDescription());
    }
}
