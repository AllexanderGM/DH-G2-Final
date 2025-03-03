package com.tours.infrastructure.repositories.tour;

import com.tours.infrastructure.entities.tour.TagTour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITagTourRepository extends JpaRepository<TagTour, Long> {
}
