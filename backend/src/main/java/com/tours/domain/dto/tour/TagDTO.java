package com.tours.domain.dto.tour;

import com.tours.infrastructure.entities.tour.TagTour;

public record TagDTO(String tag) {
    public TagDTO(TagTour tag) {
        this(tag.getTagTourOptions().getDisplayName());
    }
}
