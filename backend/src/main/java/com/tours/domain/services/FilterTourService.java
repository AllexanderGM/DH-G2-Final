package com.tours.domain.services;

import com.tours.domain.dto.tour.TourResponseDTO;
import com.tours.domain.dto.tour.filter.TourFilterDTO;
import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.repositories.filter.IFilterTourRepository;
import com.tours.infrastructure.repositories.filter.TourSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FilterTourService {

    private final IFilterTourRepository filterTourRepository;

    @Transactional
    public Page<TourFilterDTO> searchTours(String query, String tags, Pageable pageable) {
        Specification<Tour> spec = TourSpecification.filterByCriteria(query, tags);
        return filterTourRepository.findAll(spec, pageable).map(TourFilterDTO::new);
    }

}